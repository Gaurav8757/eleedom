/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import PaymentTaig from "../../Payment/PaymentTaig.jsx";
import { useAppContext } from "../../../../../context/Context.jsx";
import AadhaarKyc from "../Aadhaar/AadhaarKyc.jsx";
// import InspectionStatus from "../../VerifyInspection/InspectionStatus.jsx";
function PvtCkyc({onSubmit, token, setFormSixtyState }) {
  const {state} = useAppContext();
  const [errors, setErrors] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const proposal = state.tata.privateCar.proposer;
  const ownResponse = state.tata.privateCar.ckyc;
  const [formData, setFormData] = useState({
    proposal_no: proposal.proposal_no || "", //proposalResponses.proposal_no
    id_type: "PAN",
    id_num: "",
    req_id: "",
    gender: "",
    dob: "",
  });


  const validatePAN = (pan) => {
    // Regex for PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    // if (!pan) {
    //   alert("PAN is required."
    // }
    if (!panRegex.test(pan)) {
      setErrors("Invalid PAN format (ABCDE1234F)!");
    } else {
      setErrors("");
    }
  };
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "id_num") {
      const updatedValue = value.toUpperCase().slice(0, 10);
      // Validate PAN dynamically
      validatePAN(updatedValue);
      setFormData((prevData) => ({
        ...prevData,
        [name]: updatedValue,
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

  useEffect(() => {
    if (ownResponse?.verified) {
      // Automatically display the popup
      setShowPopup(true);
      // Auto-close popup after 5 seconds
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 10000);

      // Cleanup the timer when the component unmounts or dependencies change
      return () => clearTimeout(timer);
    }
  }, [ownResponse]);

  const renderStep = () => {
    return !ownResponse?.req_id ? (
      <div className="space-y-2 my-8">
        <div className="text-sm md:text-base px-4 text-gray-500 rounded">
          <div className="flex flex-col">
            <h1 className="text-sm text-start md:text-base font-medium space-x-2 md:space-x-4">
              PAN No.
              <span className="text-red-500 font-extrabold">*</span>
            </h1>
            <div className="flex flex-wrap space-x-4">
              <input
                type="text"
                name="id_num"
                value={formData.id_num}
                onChange={handleChange}
                placeholder="Enter PAN No."
                className={`${
                  ownResponse?.verified
                    ? "bg-slate-100 text-black"
                    : "bg-gray-100 text-black"
                } items-center text-base md:text-inherit shadow-inner p-1.5 font-medium rounded border-none active:border-none`}
                disabled={ownResponse?.verified || ownResponse?.req_id}
              />
              <button
                onClick={handleConvert}
                className={`${
                  ownResponse?.verified || ownResponse?.req_id
                    ? "bg-green-700 text-gray-50 cursor-not-allowed"
                    : "bg-gray-100 text-black active:border-b-[2px]  active:translate-y-[2px] before:bg-green-800 hover:text-gray-50 "
                }  justify-center border-b-[4px]  items-center shadow-xl text-base backdrop-blur-md lg:font-semibold isolation-auto border-none before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative md:py-2 px-3 py-1 overflow-hidden rounded group`}
                type="submit"
                disabled={ownResponse?.verified || ownResponse?.req_id}
              >
                {ownResponse?.verified ? "Verified" : "Submit"}
              </button>
            </div>
            {errors && (
              <span className="text-red-600 text-start">{errors}</span>
            )}
          </div>
        </div>
      </div>
    ) : ( ownResponse.req_id && !ownResponse.verified &&(
      // <span className="text-red-600 text-lg font-medium text-start">
      //   {`Now! You can able to use only Form60. `} <span>&#x2193;</span>
       
      // </span>
       <AadhaarKyc  token = {token} />
    )
    );
  };

  return (
    <>
      {/* {proposal.stage === "nstp" && (
            <InspectionStatus token={token} />
          )} */}
      <div className="max-w-full border shadow-inner md:p-4 p-2 tracking-wide bg-white isolation-auto border-none Z-10  relative rounded group">
        <div className={"mb-0"}>
          <div className="flex justify-center items-center">
            <h2 className="md:text-2xl tracking-wide text-base font-semibold">
              {!ownResponse.req_id ? "cKYC" : ""}
            </h2>
          </div>
        </div>
        {renderStep()}
        <div>
          {ownResponse?.verified && (
              <PaymentTaig token={token} />
          )}
        </div>
      </div>

      {/* if pan not verified then show FORM60 */}
      {!ownResponse?.verified &&  !ownResponse?.req_id && (!formData.id_num) && (
        <div className="my-4 flex justify-start">
          <span>
            Don&apos;t have a PAN?{" "}
            <button onClick={()=> setFormSixtyState(prev=>!prev)} className="text-blue-800 font-semibold tracking-wide">
              Upload Form60
            </button>
          </span>
        </div>
      )}

      {/* kyc successful message */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-green-500 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-wider mb-4">
              KYC Successful!
            </h2>
            <p>
              Thank you,{" "}
              <strong className="tracking-wider">
                {ownResponse.result?.registered_name}
              </strong>
              . Your KYC process has been completed!
            </p>
            <button
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={() => setShowPopup(false)}
            >
              PROCEED
            </button>
          </div>
        </div>
      )}

      {/* confirmation box */}
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

      {/* <div className="flex-grow overflow-auto p-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <label htmlFor="picture">Upload Image</label>
            <input
              id="picture"
              type="file"
              // onChange={handleFileChange}
              accept=".jpg,.png,.pdf"
            />
          </div>
          {/* <button onClick={handleUpload} disabled={!file} className="w-full">

            <Upload className="mr-2 h-4 w-4" /> Upload
          </button> */}
      {/* <p className="text-sm text-muted-foreground">
            Allowed file type: jpg/png/pdf, Maximum size limit of 10MB for each
            file
          </p>
          <div className="flex items-center space-x-2">
            <checkbox id="declaration" />
            <label
              htmlFor="declaration"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I hereby declare that I do not possess a PAN Card and will submit
              Form 60.
            </label>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default PvtCkyc;