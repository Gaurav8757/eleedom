import { AiOutlineClose } from "react-icons/ai";
import { AnimatePresence, motion } from "motion/react";
import { useAppContext } from "../../../../context/Context";
import Data from "../../Data";
import { useState, useEffect } from "react";
import AadhaarKyc from "./Aadhaar/AadhaarKyc";
import DlKyc from "./DL/DlKyc";
import VoterID from "./VoterID/VoterKyc";
import PassportKyc from "./Passport/PassportKyc";
import VoterKyc from "./VoterID/VoterKyc";
import CinKyc from "./CIN/CinKyc";

// eslint-disable-next-line react/prop-types
function PopupAllKyc({ isOpen, toggleModal, token }) {
  const [selectedID, setSelectedID] = useState("");
  const { state } = useAppContext();
  const formSixty = state.tata.privateCar.form60;
  const ckyc = state.tata.privateCar.ckyc;
  const Id = formSixty?.req_id?.split("_")[0];
  useEffect(() => {
    // Auto-check whenever `verified` changes
    if (ckyc.verified) {
      toggleModal(); // Close popup
    }
  }, [ckyc.verified]);
  // console.log(state.tata.privateCar);
  return (
    <div
      className={`fixed ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } inset-0 z-50 flex items-center transition-opacity backdrop-blur-sm justify-center bg-black bg-opacity-50`}
    >
      {" "}
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`bg-white max-w-3xl w-full p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${
            isOpen ? "scale-100 " : "scale-90 "
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-2 my-auto">
            <h2 className="text-base text-gray-700 font-semibold">
              Proposal ID : {formSixty.proposal_id}{" "}
            </h2>
            <button
              onClick={toggleModal}
              className="text-gray-500 hover:text-gray-800"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="text-black justify-between tracking-wide">
            <p className="uppercase font-serif bg-blue-800 bg-clip-text text-transparent">
              Please help us with the following details to accelerate your kyc
              process!
            </p>
            <p className="my-5 font-medium  text-start ml-0.5 capitalize ">
              PAN : {Id}
            </p>
            {Id && (
              <p className="px-3 border text-blue-800 border-blue-600 py-4 border-l-4 rounded-md  font-medium  text-start ml-0.5 captitalize">
                Form60 Uploaded Successfully!
              </p>
            )}
            {/* <p className="px-3 border text-blue-800 border-blue-600 py-4 border-l-4 rounded-md  font-medium  text-start ml-0.5 captitalize">
            Form60 Uploaded Successfully!
          </p> */}
          </div>

          <div className="my-8 text-start">
            <label className="block text-gray-700 font-medium mb-1">
              Choose KYC Type:
            </label>
            <select
              name="id_type"
              value={selectedID}
              onChange={(e) => setSelectedID(e.target.value)}
              className="w-full px-3 py-2 border-none cursor-pointer tracking-wider rounded bg-slate-100 shadow-inner focus:ring-0 focus:outline-none"
            >
              <option value="">Select ID Type</option>
              {Data.id_type.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* #################################################################### AADHAAR ################################################################################## */}

          {selectedID === "AADHAAR" && (
            <AadhaarKyc selectedID={selectedID} token={token} />
          )}
          {selectedID === "DL" && (
            <DlKyc selectedID={selectedID} token={token} />
          )}
          {selectedID === "VOTERID" && (
            <VoterKyc selectedID={selectedID} token={token} />
          )}
          {selectedID === "PASSPORT" && (
            <PassportKyc selectedID={selectedID} token={token} />
          )}
          {selectedID === "CKYC" && (
            <VoterID selectedID={selectedID} token={token} />
          )}
          {selectedID === "CIN" && (
            <CinKyc selectedID={selectedID} token={token} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default PopupAllKyc;
