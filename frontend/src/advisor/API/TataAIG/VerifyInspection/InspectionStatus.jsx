/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import VITE_DATA from "../../../../config/config";
import { useAppContext } from "../../../../context/Context";
import { toast } from "react-toastify";
import { CircleCheckBig, OctagonAlert } from "lucide-react";

function InspectionStatus({ token }) {
  const { state, dispatch } = useAppContext();
  const proposal = state.tata.privateCar.proposer;
  const vInsStatus = state.tata.privateCar.vInsStatus;
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  const VerifyInspectionStatus = async () => {
    setLoading(true); // Start loading
    const formData = {
      proposal_no: proposal.proposal_no || "",
      ticket_no: String(proposal.ticket_number) || "",
    };
    const headers = {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.post(
        `${VITE_DATA}/taig/motor/verify/inspection`,
        formData,
        {
          headers,
        }
      );
      if (response.data) {
        // Handle successful inspection
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_INSPECTION_STATUS",
          payload: response?.data.data[0],
        });
        // setResponseMessage(response?.data.data);
        toast.error(proposal?.ticket_desc);
      } else {
        const errorMsg =
          response.data.message_txt ||
          response.data.message ||
          "Unknown error.";
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message_txt ||
        "Error verifying inspection status.";
      toast.error(errorMsg);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Trigger API call immediately on component mount
  useState(() => {
    VerifyInspectionStatus();
  }, []);

  if (!showPopup) {
    return null; // Don't render anything if popup is closed
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex backdrop-blur-md justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-xl w-full relative">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="loader border-4 border-blue-700 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
            <p className="text-blue-600 mt-4">Verifying inspection...</p>
          </div>
        ) : (
          <div className=" text-center ">
            <div className="flex  text-slate-600 justify-between">
              <span>
                Proposal No:{" "}
                <span className="text-black"> {vInsStatus?.proposal_no}</span>
              </span>
              <span>
                Inspection No:{" "}
                <span className="text-black"> {vInsStatus?.inspection_no}</span>
              </span>
            </div>
            <div className="flex justify-center items-center flex-col max-w-sm mx-auto mt-8 mb-5">
              <div className=" w-10 h-10 flex justify-center mx-auto items-center  rounded-full  text-center">
                {vInsStatus?.inspection_status === "Pending" ? (
                  <div className=" w-10 h-10 flex justify-center mx-auto items-center  rounded-full bg-red-500 text-center">
                    <OctagonAlert className="text-white" />
                  </div>
                ) : (
                  <div className=" w-20 h-10 flex justify-center  items-center bg-green-700  rounded text-center">
                    <CircleCheckBig className="text-green-50" />
                  </div>
                )}
              </div>
              <span className="text-black tracking-wider font-semibold">
                {vInsStatus?.inspection_status}
              </span>
              <p className="text-lg font-medium  mt-2 text-gray-700">
                {vInsStatus?.result}
              </p>
              <button
                className=" text-white text-lg flex m-4 justify-center w-12 bg-blue-700 px-4 py-1 rounded animate-blink"
                onClick={() => setShowPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}
        <div className="w-6 h-6 flex justify-center -top-2 -right-2 items-center content-center bg-blue-500 hover:bg-red-500 rounded absolute">
          <button
            className="absolute text-white text-xl"
            onClick={() => setShowPopup(false)}
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}

export default InspectionStatus;
