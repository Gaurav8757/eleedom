/* eslint-disable react/prop-types */
import { useState } from "react";
import { useAppContext } from "../../../../../context/Context";
import axios from "axios";
import VITE_DATA from "../../../../../config/config.jsx";
import { toast } from "react-toastify";

function AadhaarKyc({ selectedID, panReqId }) {
  const { state, dispatch } = useAppContext();
  const formSixty = state.tata.privateCar.form60;
  const proposal = state.tata.privateCar.proposer;
  const [formData, setFormData] = useState({
    proposal_no: proposal.proposal_no || "", //proposalResponses.proposal_no
    id_type: selectedID || "AADHAAR",
    id_num: "",
    req_id: formSixty.req_id || panReqId,
    gender: "",
    dob: "",
  });

  const isAadhaarValid = formData.id_num.length === 12;
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  // show inside input
  const getDateForInput = () => {
    // Convert DD-MM-YYYY (formData) back to YYYY-MM-DD for input display
    const { dob } = formData;
    if (!dob) return ""; // Return empty if no DOB set
    const [day, month, year] = dob.split("-");
    return `${year}-${month}-${day}`;
  };
  // change yyyy-mm-dd to dd-mm-yyyy
  const dateFormat = (dateString) => {
    if (!dateString) return ""; // Handle empty input
    const [year, month, day] = dateString.split("-");
    if (year && month && day) {
      return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
    }
    return dateString; // Return original if format is invalid
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For id_num, ensure only numeric input
    if (name === "id_num") {
      if (/^\d*$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
    // For dob, format the date
    else if (name === "dob") {
      const formattedDate = dateFormat(value); // Convert to DD-MM-YYYY
      setFormData((prev) => ({
        ...prev,
        [name]: formattedDate,
      }));
    }
    // Default case for other fields
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAadharSubmit = async (formData) => {
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
        toast.success(`${response.data.message_txt}`);
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_AADHAAR_OTP",
          payload: response.data.data,
        });
      } else {
        if (response.data.message_txt) {
          toast.error(`${response.data.message_txt}`);
        }
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message_txt || "Error to get otp response"
      );
      // handleSessionExpiry();
    }
  };

  //   onSubmit={submitHandler}

  return (
    <div className="flex flex-col ">
      {panReqId && (
        <h1 className="text-lg font-semibold my-5 tracking-wider">
          KYC with Aadhar Card{" "}
        </h1>
      )}

      <form
        onSubmit={handleAadharSubmit}
        className="bg-white rounded transition-all animate-fade-in transform  grid grid-cols-2 gap-4 justify-between"
      >
        {/* Aadhaar Number */}
        <div className="mb-4 text-start ">
          <label className="block  text-gray-700 font-medium">
            Aadhaar Number:
          </label>
          <input
            type="text"
            name="id_num"
            value={formData.id_num}
            onChange={handleChange}
            maxLength="12"
            placeholder="Enter 12-digit Aadhaar number"
            className={`w-full px-3 py-2  tracking-widest rounded ${
              isAadhaarValid ? "border-none" : "border border-red-500"
            } shadow-inner bg-slate-100 focus:ring-0   focus:outline-none`}
          />
          {!isAadhaarValid && formData.id_num.length > 0 && (
            <p className="text-red-500 text-xs mt-0.5">
              Aadhaar No must be 12 digits.
            </p>
          )}
        </div>
        {/* Full Name */}
        <div className="mb-4 text-start">
          <label className="block text-gray-700 font-medium">
            Full Name (as per Aadhaar):
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter full name"
            className="w-full px-3 py-2 border-none  tracking-wider capitalize rounded shadow-inner bg-slate-100 focus:ring-0  focus:outline-none"
          />
        </div>

        <div className="mb-4 text-start ">
          <label className="block text-gray-700 font-medium mb-2">
            Gender:
          </label>
          <div className="flex justify-around items-center space-x-4">
            {/* Male */}
            <label className="flex items-center cursor-pointer space-x-2">
              <input
                type="radio"
                name="gender"
                value="M"
                checked={formData.gender === "M"}
                onChange={handleChange}
                className="form-radio text-blue-600 focus:ring-0"
              />
              <span className="text-gray-700">Male</span>
            </label>

            {/* Female */}
            <label className="flex items-center cursor-pointer space-x-2">
              <input
                type="radio"
                name="gender"
                value="F"
                checked={formData.gender === "F"}
                onChange={handleChange}
                className="form-radio text-blue-600  focus:ring-0"
              />
              <span className="text-gray-700">Female</span>
            </label>

            {/* Transgender */}
            <label className="flex items-center cursor-pointer space-x-2">
              <input
                type="radio"
                name="gender"
                value="T"
                checked={formData.gender === "T"}
                onChange={handleChange}
                className="form-radio text-blue-600 focus:ring-0"
              />
              <span className="text-gray-700">Transgender</span>
            </label>
          </div>
        </div>

        {/* Date of Birth */}
        <div className="mb-4 text-start">
          <label className="block text-gray-700 font-medium">DOB:</label>
          <input
            type="date"
            name="dob"
            max={eighteenYearsAgo}
            value={getDateForInput()}
            onChange={handleChange}
            placeholder="DD-MM-YYYY"
            className="w-full px-3 py-2 border-none rounded shadow-inner tracking-wider bg-slate-100 focus:ring-0  focus:outline-none"
          />
        </div>
        <span className="col-span-2 text-start text-slate-700 italic tracking-wide">
          In case CKYC record is not found, OTP based verification will be
          initated.
        </span>
        <div className="flex justify-center mt-5 col-span-2 ">
          <button
            type="submit"
            className={`transition-all  text-base bg-blue-600 text-white font-bold px-4 py-2 tracking-widest rounded border-blue-700 border-b-[3px] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:border-b-[2px] active:brightness-90 active:translate-y-[1px] active:text-slate-400`}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AadhaarKyc;
