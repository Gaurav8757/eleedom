/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import { AnimatePresence, motion } from "motion/react";
import { useAppContext } from "../../../../../context/Context.jsx";
import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";
import VITE_DATA from "../../../../../config/config.jsx";
function OvdForm({token}) {
  const { state, dispatch } = useAppContext();
  const proposal = state.tata.privateCar.proposer;
  const ckyc = state.tata.privateCar.ckyc;
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const tokens = sessionStorage.getItem("auth_access_token");
  const [formData, setFormData] = useState({
    req_id: ckyc?.data?.req_id,
    proposal_no: proposal?.proposal_no || "",
    id_type: "OVD",
    doc_type: "",
    doc_base64: "",
  });
  // useEffect(() => {
  //   // Auto-check whenever `verified` changes
  //   if (ckyc?.verified) {
  //     setFormOvdState(false); // Close popup
  //   }
  // }, [ckyc?.verified, setFormOvdState]);

  const [fileName, setFileName] = useState("");
  const [docs, setDocs] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [check, setCheck] = useState(false);

  const handleChange = (e) => {
    const { type, checked } = e.target;
    if (type === "checkbox") {
      // Handle checkbox changes
      setCheck(checked);
    }
  };

  // file upload
  const handleFileUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file uploaded.");
      return;
    }
    const reader = new FileReader();
    // Map file MIME type to enum values
    const getNormalizedDocType = (type) => {
      if (type.includes("pdf")) return "pdf";
      if (type.includes("image")) return "image";
      return "unknown"; // Fallback for unsupported types
    };
    const normalizedDocType = getNormalizedDocType(file.type);

    reader.onload = (event) => {
      const base64String = event.target.result.split("base64,")[1];
      if (normalizedDocType === "unknown") {
        toast.error("Unsupported file type. Allowed: PDF, Images (JPG/PNG).");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        doc_base64: base64String,
        doc_type: normalizedDocType,
      }));
      setDocs(event.target.result);
    };

    reader.readAsDataURL(file);
    setFileName(file.name);

    if (normalizedDocType.includes("pdf")) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };
  // Drag n Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) {
      console.error("No file dropped.");
      return;
    }
    const reader = new FileReader();
    // Map file MIME type to enum values
    const getNormalizedDocType = (type) => {
      if (type.includes("pdf")) return "pdf";
      if (type.includes("image")) return "image";
      return "unknown"; // Fallback for unsupported types
    };
    const normalizedDocTypes = getNormalizedDocType(file.type);

    reader.onload = (event) => {
      const base64String = event.target.result.split("base64,")[1];

      if (normalizedDocTypes === "unknown") {
        toast.error("Unsupported file type. Allowed: PDF, Images (JPG/PNG).");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        doc_base64: base64String,
        doc_type: normalizedDocTypes,
      }));
      setDocs(event.target.result);
    };

    reader.readAsDataURL(file);
    setDragOver(false);
    setFileName(file.name);

    if (normalizedDocTypes.includes("pdf")) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleSubmit = () => {
    if (check) {
      onSubmitFormOVD(formData);
    } else {
      toast.error("Please check the checkbox before submitting.");
    }
  };

  const onSubmitFormOVD = async (formData) => {
    const headers = {
      Authorization: `${token || tokens} `,
      "Content-Type": "application/json",
    };
    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_DATA}/taig/motor/form/sixty`,
        formData,
        {
          headers,
        }
      );
      setLoading(false);
      toast.success(`${response.data.message_txt || response.data.message}`);
      dispatch({
        type: "SET_TATA_PRIVATE_CAR_CKYC",
        payload: response.data.data,
      });
    } catch (error) {
      toast.error(error.response?.data?.message_txt || "Error to upload OVD");
      setLoading(false);
      // handleSessionExpiry();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="block  min-h-64  mb-20 p-6 border border-gray-200 rounded shadow bg-gray-100"
      >
        {/* <span className="text-end">{proposalResponses}</span> */}
        <h1 className="text-sm tracking-wider text-start md:text-base font-medium space-x-2 md:space-x-4">
          Upload OVD
          <span className="text-red-500 font-extrabold">*</span>
        </h1>
        <div className="flex flex-col min-w-full justify-between space-y-3">
          <label
            htmlFor="ovd"
            className={`w-full min-h-32 cursor-pointer flex items-center flex-col justify-center border transition-all ${
              dragOver
                ? "border-blue-500 bg-blue-100"
                : "border-gray-500 bg-gray-200"
            } border-dashed`}
            onDragOver={(e) => {
              e.preventDefault(); // Necessary to allow dropping
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop} // Reset state on drop
          >
            {formData.doc_base64 ? (
              <>
                {["image"].some((type) => formData.doc_type.includes(type)) && (
                  <img src={docs} className="h-28 mt-2 w-auto" />
                )}
                <PdfPreviewModal
                  pdfUrl={docs}
                  isOpen={formData.doc_type.includes("pdf") && isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                />
                <p className="my-2">{fileName}</p>
                {formData.doc_type.includes("pdf") && (
                  <button
                    className={`transition-all text-base bg-blue-600 text-white font-mono font-bold px-4 py-1 tracking-wider rounded border-blue-700 border-b-[3px] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:border-b-[2px] active:brightness-90 active:translate-y-[1px] active:text-slate-400`}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Preview
                  </button>
                )}
              </>
            ) : (
              <>
                <p>Click or Drag and Drop</p>

                <span className="flex mt-2 font-mono text-start italic text-sm">
                  &quot;Allowed file types:jpg/png/pdf, Max Size limit of 10 MB
                  for each file.&quot;
                </span>
              </>
            )}
          </label>
          <input
            className="hidden w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 focus:outline-none"
            aria-describedby="user_avatar_help"
            id="ovd"
            type="file"
            onChange={handleFileUpload}
            accept="image/jpeg, image/png, application/pdf"
          />

          <div className="flex items-center gap-3">
            <input
              className="flex text-start border cursor-pointer border-gray-600 outline-none peer focus:ring-0  focus:border-blue-700 checked:border-none rounded h-6 w-6"
              type="checkbox"
              checked={check}
              onChange={handleChange}
            />
            <span className="font-medium tracking-wide">
              {" "}
              {`I hereby declare that I do not possess a ${"pan"} and will submit OVD.`}
            </span>
          </div>
          <div className="flex justify-center items-center">
            <button
              onClick={handleSubmit}
              className={`${
                !check
                  ? "cursor-not-allowed bg-gray-500 border-gray-700"
                  : "cursor-pointer bg-blue-600 border-blue-700"
              } transition-all text-base mt-10  text-white font-mono font-bold px-4 py-2 tracking-wider rounded  border-b-[3px] hover:brightness-110  disabled:cursor-not-allowed active:border-b-[2px] active:brightness-90 active:translate-y-[1px] active:text-slate-400`}
              type="submit"
              disabled={!check}
            >
              Submit
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
export default OvdForm;

const PdfPreviewModal = ({ isOpen, onClose, pdfUrl }) => {
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [onClose]);

  if (!isOpen) return null; // Render nothing if the modal is not open

  return (
    <div
      className="fixed inset-0 z-50 flex backdrop-blur-md justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }} // Close modal on background click
    >
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative bg-white mt-5 rounded-lg shadow-lg w-[80%] max-w-4xl h-[88%]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">PDF Preview</h2>
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
            >
              <AiOutlineClose
                size={24}
                className="hover:bg-blue-500 hover:text-white transition-all rounded"
              />
            </button>
          </div>

          {/* PDF Preview */}
          <div className="h-full">
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full z-100"
              style={{ border: "none" }}
              title="PDF Preview"
            ></iframe>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
