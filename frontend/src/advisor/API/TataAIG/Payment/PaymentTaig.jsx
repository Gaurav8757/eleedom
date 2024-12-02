/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import VITE_DATA from "../../../../config/config.jsx";
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAppContext } from "../../../../context/Context.jsx";

function PaymentTaig({ token }) {
  const { state } = useAppContext();
  const proposal = state.tata.privateCar.proposer;
  const ownResponse = state.tata.privateCar.ckyc;

  const [formData, setFormData] = useState({
    payment_mode: "onlinePayment",
    deposit_in: "Bank",
    online_payment_mode: "UPI",
    payer_type: "Customer",
    payer_id: "",
    payer_relationship: "",
    payer_pan_no: ownResponse?.id_num || "",
    payer_name: ownResponse?.result.customer_name || "",
    email: "mr.gaurav@gmail.com",
    mobile_no: proposal?.mobile_no || "",
    pan_no: ownResponse?.id_num || "",
    payment_id: [proposal?.payment_id] || [],
    returnurl: `${VITE_DATA}/advisor/tata_aig/motor/verif/pay`,
    // returnurl: "https://uatapigw.tataaig.com/motor/v1/policy-download",
    // returnurl: ""
  });

  const [isChecked, setIsChecked] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  function openPopup() {
    const url = `${paymentLink}`; // URL to open in the popup
    const windowName = '_blank'; // Target a new tab
    const windowFeatures = 'width=1200,height=600,resizable=yes,scrollbars=yes'; // Set the size and features of the popup window
    // Open the URL in a new tab as a popup
    const popup = window.open(url, windowName, windowFeatures);
    if (popup) {
      // Optional: Do something after the popup opens, if needed
      console.log('Popup opened successfully');
    } else {
      toast.error('Popup blocked by browser');
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = async () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);

    if (newCheckedState) {
      try {
        const headers = {
          Authorization: token,
          "Content-Type": "application/json",
        };
        const response = await axios.post(
          `${VITE_DATA}/taig/motor/initiate/pay`,
          {
            ...formData,
            pan_no: ownResponse.id_type !== "PAN" ? "" : formData.pan_no,
            payer_pan_no:
              ownResponse.id_type !== "PAN" ? "" : formData.payer_pan_no,
          },
          { headers }
        );
        const { data } = response;
        if (data?.status === 200 && data.message_txt === "Success") {
          const parsedData = JSON.parse(data.data); // Parse the JSON string
          const paymentUrl = parsedData.url; // Extract the URL
          setPaymentLink(paymentUrl);
          toast.success("Payment Link Generated Successfully..!");
        } else {
          toast.error(`${data?.message_txt || data?.message}`);
          setPaymentLink(""); // Clear payment link on error
        }
      } catch (error) {
        console.error("Payment error:", error.response || error.message);
        toast.warn(`${error}`);
        setPaymentLink(""); // Clear payment link on error
      }
    } else {
      setPaymentLink(""); // Clear payment link if unchecked
    }
  };
  const handleCopyClick = () => {
    setCopySuccess(true); // Set to true when the copy button is clicked
    setTimeout(() => {
      setCopySuccess(false); // Reset to false after 2 seconds
    }, 3000);
  };

  const PaymentLinkButton = ({ paymentLink }) => {
    return (
      <div className="relative group">
        <CopyToClipboard text={paymentLink}>
          <button
            onClick={handleCopyClick}
            className={`${
              copySuccess
                ? "bg-green-600 text-slate-100 border-green-700"
                : "bg-slate-100 text-slate-400 border-slate-700"
            } group flex justify-center shadow-inner items-center text-base md:text-inherit p-1 border-none active:border-none transition-all   text-white font-mono font-bold mr-5 rounded-lg  border-b-[4px] disabled:opacity-50 disabled:cursor-not-allowed active:border-b-[2px] active:brightness-90 active:translate-y-[2px] active:text-black`}
          >
            <svg
              className={`${
                copySuccess ? "stroke-slate-100" : "stroke-blue-700"
              }  fill-none `}
              xmlns="http://www.w3.org/2000/svg"
              width="28px"
              height="28px"
              viewBox="0 -0.5 25 25"
            >
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M15.17 11.053L11.18 15.315C10.8416 15.6932 10.3599 15.9119 9.85236 15.9178C9.34487 15.9237 8.85821 15.7162 8.51104 15.346C7.74412 14.5454 7.757 13.2788 8.54004 12.494L13.899 6.763C14.4902 6.10491 15.3315 5.72677 16.2161 5.72163C17.1006 5.71649 17.9463 6.08482 18.545 6.736C19.8222 8.14736 19.8131 10.2995 18.524 11.7L12.842 17.771C12.0334 18.5827 10.9265 19.0261 9.78113 18.9971C8.63575 18.9682 7.55268 18.4695 6.78604 17.618C5.0337 15.6414 5.07705 12.6549 6.88604 10.73L12.253 5"
              ></path>
            </svg>
          </button>
        </CopyToClipboard>
        <div className="absolute text-nowrap hidden group-hover:block bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded-md shadow-lg top-full mt-1">
          {copySuccess ? "Copied!" : "Copy to Clipboard"}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col ">
      {ownResponse?.verified && (
        <>
          {" "}
          <h1 className="text-xl tracking-wider font-medium">Make Payment</h1>
          <div
            className={`${
              ownResponse?.verified ? "mt-4" : "mt-10"
            } flex flex-col max-w-lg mx-3 bg-white border border-gray-200 rounded-t-lg shadow text-slate-500`}
          >
            <span className="text-lg flex text-start text-white p-3 bg-blue-600 tracking-wider font-medium space-x-2 mb-2 ">
              {sessionStorage.getItem("selectedOption")}
            </span>
            <div className="p-3">
              <>
                <h1 className="text-sm text-center tracking-wider font-medium space-x-2 mb-2 relative">
                  Premium (Including GST)
                </h1>
                <span className=" text-lg tracking-wide text-black font-semibold">
                  ₹ {proposal.premium_value}
                </span>
              </>
              <hr className="my-4" />
              <>
                <h1 className="text-sm text-start tracking-wider font-medium space-x-2 mb-2 relative">
                  Insured Name:{" "}
                  <span className="text-black font-bold">
                    {ownResponse?.result?.customer_name}{" "}
                  </span>
                </h1>
                <h1 className="text-sm text-start tracking-wider font-medium space-x-2 mb-2 relative">
                  Proposal Number:{" "}
                  <span className="text-black font-bold">
                    {proposal.proposal_no}
                  </span>
                </h1>
                <h1 className="text-sm text-start tracking-wider font-medium space-x-2 mb-2 relative">
                  Quotation Number:{" "}
                  <span className="text-black font-bold">
                    {proposal.quote_no}
                  </span>
                </h1>
              </>
            </div>
          </div>{" "}
          <div className="flex flex-col my-auto justify-start">
            <h2 className="text-xl  mx-3 text-start mt-20 m-4 tracking-wider font-medium">
              Online Payment
            </h2>

            <div className="flex max-w-sm justify-start space-x-4 items-center">
              <input
                id="pay-checkbox"
                type="checkbox"
                className="hidden peer"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor="pay-checkbox"
                className={`flex w-6 h-6 p-2  items-center justify-center shadow-inner text-gray-500 bg-slate-100 border border-red-500 rounded cursor-pointer 
            peer-checked:border-blue-600 peer-checked:bg-gradient-to-t from-blue-700 to-blue-600 peer-checked:text-white hover:text-gray-600 hover:bg-gray-100`}
              >
                <div className="flex items-center text-xs font-semibold capitalize">
                  {isChecked ? "Yes" : ""}{" "}
                </div>
              </label>
              <span className="text-base font-semibold tracking-wider font-serif">
                I confirm the payment details.
              </span>
            </div>
            <div className="flex justify-start m-4 items-center mt-8">
              <button
                className={`transition-all text-lg bg-green-600 text-white font-mono font-bold px-4 py-1.5 mr-5 rounded-md border-green-700 border-b-[4px] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:border-b-[2px] active:brightness-90 active:translate-y-[2px] active:text-black`}
               
                onClick={() => {
                  if (paymentLink) {
                    // window.open(paymentLink, "_blank"); // Open payment link in a new tab
                    openPopup();
                  }
                }}
                disabled={!isChecked || !paymentLink} // Disable if unchecked or no link
              >
                Make Payment
              </button>
              {PaymentLinkButton({ paymentLink })}
            </div>
          </div>
        </>
      )}
     


    </div>
  );
}

export default PaymentTaig;
