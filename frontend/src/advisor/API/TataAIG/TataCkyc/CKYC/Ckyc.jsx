/* eslint-disable react/prop-types */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion"; // Fixed import
import { useAppContext } from "../../../../../context/Context.jsx";
import axios from "axios";
import VITE_DATA from "../../../../../config/config.jsx";
import { toast } from "react-toastify";
function Ckyc({ selectedID, token }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { state, dispatch } = useAppContext();
  const formSixty = state.tata.privateCar.form60;
  const proposal = state.tata.privateCar.proposer;
  const ckyc = state.tata.privateCar.ckyc;
  const [cKyc, setcKyc] = useState(new Array(4).fill(""));

  const [formData, setFormData] = useState({
    proposal_no: proposal.proposal_no || "",
    id_type: selectedID || "cKyc",
    id_num: "",
    dob: "",
    req_id: formSixty.req_id || ckyc.req_id,
  });

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  // Convert DD-MM-YYYY to YYYY-MM-DD for input
  const getDateForInput = () => {
    const { dob } = formData;
    if (!dob) return "";
    const [day, month, year] = dob.split("-");
    return `${year}-${month}-${day}`;
  };

  // Convert YYYY-MM-DD to DD-MM-YYYY for storage
  const dateFormat = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // HancKyce Date of Birth (DOB) formatting
    if (name === "dob") {
      const formattedDate = dateFormat(value); // Convert YYYY-MM-DD to DD-MM-YYYY
      setFormData((prev) => ({
        ...prev,
        [name]: formattedDate,
      }));
      return;
    }

    // HancKyce cKyc parts
    if (name.startsWith("cKyc_part_")) {
      const index = parseInt(name.replace("cKyc_part_", ""), 10); // Extract part index
      if (isNaN(index) || index < 0 || index >= cKyc.length) return;
      const validationRules = [
        /^[0-9]{0,14}$/, // Part 4: Up to 9 digits only
      ];
      // Validate input
      if (!validationRules[index]?.test(value)) return;

      // Update cKyc parts and `formData.id_num`
      setcKyc((prevcKyc) => {
        const updatedcKyc = [...prevcKyc];
        updatedcKyc[index] = value;

        setFormData((prevFormData) => ({
          ...prevFormData,
          id_num: updatedcKyc.join(""),
        }));

        return updatedcKyc;
      });
      return;
    }
    // HancKyce other fields
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlecKycSubmit = async (formData) => {
    const headers = {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.post(
        `${VITE_DATA}/taig/motor/ckyc`,
        formData,
        {
          headers,
        }
      );

      if (response.data.status === 200) {
        toast.success(`${response?.data.message_txt}`);
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_CKYC",
          payload: response?.data.data,
        });
      } else {
        toast.error(`${response.data.message_txt || response.data.message}`);
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_CKYC",
          payload: response?.data,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error in KYC response");
      // hancKyceSessionExpiry();
    }
  };

  const handlecKycConvert = () => {
    setShowConfirmation(true);
  };
  const confirmFinalize = () => {
    handlecKycSubmit(formData);
    // Form conversion is confirmed
    setShowConfirmation(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="form"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="flex flex-wrap justify-between gap-6"
      >
        <div className="text-start w-full max-w-xs">
          <label className="text-gray-700 font-medium">cKyc Number:</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="cKyc_part_0"
              value={cKyc[0]}
              onChange={handleChange}
              maxLength={14}
              placeholder="1234567"
              className="w-72 text-center bg-slate-100 rounded font-bold  border-none tracking-widest"
            />
          </div>
        </div>

        <div className="text-start w-full max-w-xs">
          <label className="block text-gray-700 font-medium">DOB:</label>
          <input
            type="date"
            name="dob"
            max={eighteenYearsAgo}
            value={getDateForInput()}
            onChange={handleChange}
            className="w-full bg-slate-100 rounded shadow-inner border-none"
          />
        </div>
      </motion.div>
      <div className="flex mt-10 justify-center">
        <button
          type="submit"
          onClick={handlecKycConvert}
          className="bg-blue-600 text-white font-bold px-4 py-2 rounded hover:brightness-110"
        >
          Submit
        </button>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            key="popup"
            className="bg-white p-4 rounded shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h3 className="text-lg font-semibold mb-8">
              {`Are you sure you want to submit cKyc Information ?`}
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300  cursor-pointer transition-all text-black font-mono font-bold px-6 py-1 rounded-lg
          border-gray-400
            border-b-[4px] hover:brightness-110  
            active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                onClick={() => setShowConfirmation(false)}
              >
                No
              </button>
              <button
                className=" cursor-pointer transition-all bg-green-600 text-black font-mono font-bold px-6 py-1 rounded-lg
          border-green-700
            border-b-[4px] hover:brightness-110 
            active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                onClick={confirmFinalize} // Set formData.__finalize to "1"
              >
                Yes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Ckyc;