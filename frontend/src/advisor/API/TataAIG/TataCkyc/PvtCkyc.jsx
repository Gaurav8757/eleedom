/* eslint-disable react/prop-types */
import { useState } from "react";
function PvtCkyc({ proposalResponses, onSubmit }) {
  // const [errors, setErrors] = useState({});
  const proposal = proposalResponses[0] || "";

  const [formData, setFormData] = useState({
    proposal_no: proposal.proposal_no || "", //proposalResponses.proposal_no
    id_type: "PAN",
    id_num: "",
    req_id: "",
    // gender: "",
    // dob: "",
  });

  const validatePAN = (pan) => {
    // Regex for PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    // if (!pan) {
    //   alert("PAN is required."
    // }
    if (!panRegex.test(pan)) {
      return "Invalid PAN format (ABCDE1234F)!";
    }
    return ""; // No error
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "id_num") {
      const updatedValue = value.toUpperCase().slice(0, 10);
      // Validate PAN dynamically
      const error = validatePAN(updatedValue);
      setFormData((prevData) => ({
        ...prevData,
        [name]: updatedValue || error,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // data sent to api
  const handleSubmit = () => {
    onSubmit(formData); // Pass data to the parent component
  };
  // proceed to kyc button
  const handleConvert = () => {
    setShowConfirmation(true);
  };
  // final call on yes
  const confirmFinalize = () => {
    handleSubmit();
    // Form conversion is confirmed
    setShowConfirmation(false);
  };

  const renderStep = () => {
    return (
      <div className="space-y-2">
        <div className="grid md:grid-cols-6 grid-cols-2 text-sm md:text-base text-gray-500 justify-items-stretch p-2 gap-8 rounded">
          <div className="flex flex-col">
            <h1 className="text-sm text-start md:text-base font-semibold space-x-2 md:space-x-4">
              Quote No.
            </h1>
            <div className="flex flex-wrap">
              <input
                type="text"
                name="quote_no"
                value={proposal.quote_no}
                className="items-center text-base md:text-inherit shadow-inner p-1.5 bg-gray-200 font-semibold rounded border-none"
                disabled
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-sm text-start md:text-base font-semibold space-x-2 md:space-x-4">
              Proposal No.
            </h1>
            <div className="flex flex-wrap">
              <input
                type="text"
                name="proposal_no"
                value={formData.proposal_no}
                onChange={handleChange}
                disabled
                className="items-center text-base md:text-inherit shadow-inner p-1.5 bg-gray-200 font-semibold rounded border-none"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm text-start md:text-base font-semibold space-x-2 md:space-x-4">
              Total Premium
            </h1>
            <div className="flex flex-wrap relative">
              <span className="absolute text-base left-2 top-[14px] transform -translate-y-1/2 text-gray-500 font-semibold">
                ₹
              </span>
              <input
                type="text"
                name="premium_value"
                value={proposal.premium_value}
                className="items-center ps-5 text-base md:text-inherit shadow-inner p-1.5 bg-gray-200 text-black font-semibold rounded border-none active:border-none"
                disabled
              />
              <span className="text-blue-800 text-sm font-semibold">
                (Inclusive of GST)
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-sm text-start md:text-base font-semibold space-x-2 md:space-x-4">
              PAN No.
              <span className="text-red-500 font-extrabold">*</span>
            </h1>
            <div className="flex flex-wrap">
              <input
                type="text"
                name="id_num"
                value={formData.id_num}
                onChange={handleChange}
                placeholder="Enter PAN No."
                className="items-center text-base md:text-inherit shadow-inner p-1.5 bg-gray-100 text-black font-medium rounded border-none active:border-none"
              />
            </div>
          </div>
          <div className=" flex-col my-auto">
            <button
              onClick={handleConvert}
              className="flex justify-center border-b-[4px] active:border-b-[2px]  active:translate-y-[2px] items-center shadow-xl text-base bg-slate-100 backdrop-blur-md lg:font-semibold isolation-auto border-none before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded before:bg-green-800 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative md:py-2 px-3 py-1 overflow-hidden rounded group"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="max-w-full border shadow-inner md:p-4 p-2 tracking-wide bg-slate-50  isolation-auto border-none Z-10  relative rounded group">
        <div className={"mb-8"}>
          <div className="flex justify-center items-center">
            <h2 className="md:text-2xl tracking-wide text-base font-semibold">
              {"cKYC"}
            </h2>
          </div>
        </div>
        {renderStep()}
      </div>
      <div className="my-4 flex justify-start">
        <span>
          Don&apos;t have a PAN?{" "}
          <button className="text-blue-800 font-semibold tracking-wide">
            Upload Form 60
          </button>
        </span>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-8 text-start">
              {`Are you sure, you want to proceed`} {`to complete cKYC?`}
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
                onClick={confirmFinalize}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PvtCkyc;
