/* eslint-disable react/prop-types */
import { useState } from "react";

function PvtCkyc({ proposalResponses, onSubmit }) {
  const proposal = proposalResponses[0] || "";
console.log(proposal);

  const [formData, setFormData] = useState({
    proposal_no: proposalResponses[0].proposal_no || "",
    id_type: "PAN",
    id_num: "",
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const confirmFinalize = () => {
    handleSubmit();
    setShowConfirmation(false);
  };

  const renderForm = () => (
    <div className="space-y-2">
      <div className="grid md:grid-cols-6 grid-cols-2 text-sm md:text-base text-gray-500 p-2 gap-8 rounded">
        <FormInput
          label="Quote No."
          value={proposal.quote_no}
          disabled
          name="quote_no"
        />
        <FormInput
          label="Proposal No."
          value={formData.proposal_no}
          name="proposal_no"
          onChange={handleChange}
          disabled
        />
        <FormInput
          label="Total Premium"
          value={proposal.premium_value}
          disabled
          note="(Inclusive of GST)"
          className="font-bold text-black"
        />
         <FormInput
          label="PAN Number"
          name="id_num"
          value={formData.id_num}
          onChange={handleChange}
          placeholder="Enter PAN Number"
        />
      </div>
    </div>
  );

  return (<>
    <div className="max-w-full border shadow-inner md:p-4 p-2 bg-slate-50 rounded relative">
      <Header title="CKYC" />
      {renderForm()}
    
      {showConfirmation && (
        <ConfirmationModal
          onCancel={() => setShowConfirmation(false)}
          onConfirm={confirmFinalize}
          message={`Are you sure you want to finalize ${proposal.quote_no} ${proposal.proposal_no} to complete cKYC?`}
        />
      )}
    </div>
      <div className="my-4 flex justify-end">
      <SubmitButton text="Proceed to cKYC" />
    </div>
    </>);
}

const Header = ({ title }) => (
  <div className="mb-8 flex justify-center items-center">
    <h2 className="md:text-2xl text-base font-bold">{title}</h2>
  </div>
);

const FormInput = ({ label, value, name, onChange, readOnly, disabled, placeholder, className, note }) => (
  <div className="flex flex-col">
    <label className="flex text-sm md:text-base font-semibold">{label}</label>
    <div className="flex flex-wrap">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`flex items-center shadow-inner p-1.5 bg-gray-200 rounded border-none ${className || ""}`}
        readOnly={readOnly}
        disabled={disabled}
      />
      {note && <span className="text-sm font-semibold text-blue-800">{note}</span>}
    </div>
  </div>
);



// const FormSelect = ({ label, name, value, onChange, options, defaultOption }) => (
//   <div className="flex flex-col">
//     <label className="flex text-sm md:text-base font-semibold">{label}</label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="flex shadow-inner p-1.5 bg-slate-100 rounded border-none font-semibold text-gray-500 cursor-pointer"
//     >
//       <option value="">{defaultOption}</option>
//       {options.map((option, idx) => (
//         <option key={idx} value={option}>
//           {option}
//         </option>
//       ))}
//     </select>
//   </div>
// );

const SubmitButton = ({ text }) => (
  <button
    type="submit"
    className="px-3 py-1 md:px-8 md:py-2 bg-slate-100 shadow-xl rounded border-none font-semibold text-lg active:translate-y-[2px] active:border-b-[2px]"
  >
    {text}
  </button>
);

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
    <div className="bg-white p-4 rounded shadow-lg">
      <h3 className="text-lg font-semibold mb-4">{message}</h3>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="bg-gray-300 text-black font-bold px-6 py-1 rounded-lg border-gray-400 active:translate-y-[2px]"
        >
          No
        </button>
        <button
          onClick={onConfirm}
          className="bg-green-600 text-white font-bold px-6 py-1 rounded-lg border-green-700 active:translate-y-[2px]"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
);

export default PvtCkyc;
