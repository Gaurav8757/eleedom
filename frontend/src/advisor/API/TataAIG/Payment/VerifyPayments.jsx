import { useState, useEffect } from "react";
import axios from "axios";
import VITE_DATA from "../../../../config/config.jsx";
import { toast } from "react-toastify";

function VerifyPayments() {
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [encryptedPolicyId, setEncryptedPolicyId] = useState(null);
  const [download, setDownload] = useState();
  const token = sessionStorage.getItem("auth_access_token");
  const baseUrl = window.location.origin;

  useEffect(() => {
    // Trigger verification automatically on component load
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    setIsLoading(true);
    try {
      const headers = {
        Authorization: token,
        "Content-Type": "application/json",
      };
      const payment_id = sessionStorage.getItem("id");

      const response = await axios.post(
        `${VITE_DATA}/taig/motor/verif/pay`,
        { payment_id },
        {
          headers,
        }
      );
      toast.error(response.data.message);
      setMessage(response.data.message);
      const encryptedId = response?.data?.data?.encrypted_policy_id;
      setEncryptedPolicyId(encryptedId);
      setPopupOpen(true);
    } catch (error) {
      toast.error(`${error?.response?.data?.message_txt || error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const downloadPolicy = async () => {
    if (!encryptedPolicyId) return;
    if (download) return;
    try {
      const headers = {
        Authorization: token,
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        `${VITE_DATA}/taig/motor/download/policy/${encryptedPolicyId}`,
        { headers }
      );
      const { data } = response;
      const binaryData = atob(data.byteStream);
      const arrayBuffer = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "policy.pdf");
      document.body.appendChild(link);
      link.click();
      setDownload(data.download);
    } catch (error) {
      console.error("Error downloading policy:", error);
      toast.error("Failed to download policy. Please try again.");
    }
  };
  const closeHandler = (e) => {
    e.preventDefault();
    handleHomepage();
    setPopupOpen(false);
  };

  const handleHomepage = () => {
    window.location.href = `${baseUrl}/advisor/home/insurance`;
    setPopupOpen(false);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Verify Payment Button */}

      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <div role="status mx-auto">
              <svg
                aria-hidden="true"
                className="mx-auto w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              {/* <span className="pt-10">Loading...</span> */}
            </div>
          </div>
        </div>
      )}

      {/* Popup */}
      {popupOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            {message ? (
              <>
                {" "}
                <h2 className="text-lg font-semibold  tracking-wider text-red-600">
                  Payment Verification Failed!
                </h2>
                <div className="flex justify-around mt-6">
                  <button
                    className="px-4 py-1 bg-red-600 text-white font-medium tracking-wider rounded hover:bg-red-700"
                    onClick={closeHandler}
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-1 bg-blue-600 text-white font-medium tracking-wider rounded hover:bg-blue-700"
                    onClick={() => window.location.reload()}
                  >
                    Reload
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold tracking-wider text-green-600">
                  Payment Verified!
                </h2>
                <p className="mt-2 text-gray-600  tracking-wide">
                  Your policy is ready to download.
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    className={`${
                      download
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 cursor-pointer"
                    }    px-4 py-2  text-white font-medium rounded`}
                    onClick={downloadPolicy}
                  >
                    {download === true ? "Downloaded" : "Download Policy"}
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700"
                    onClick={handleHomepage}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyPayments;
