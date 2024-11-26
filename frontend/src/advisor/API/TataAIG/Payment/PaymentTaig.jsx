/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import VITE_DATA from "../../../../config/config.jsx";
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";

function PaymentTaig({ ckycResponses, proposalResponses, token }) {
  const [formData, setFormData] = useState({
    payment_mode: "onlinePayment",
    deposit_in: "Bank",
    online_payment_mode: "UPI",
    payer_type: "Customer",
    payer_id: "",
    payer_relationship: "",
    payer_pan_no: ckycResponses?.id_num || "",
    payer_name: ckycResponses?.result.customer_name || "",
    email: "mr.gaurav@gmail.com",
    mobile_no: "9687687768",
    pan_no: ckycResponses?.id_num || "",
    payment_id: [proposalResponses?.payment_id] || [],
    returnurl: "https://www.eleedomimf.com/advisor/tata_aig/motor",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

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
          formData,
          { headers }
        );
        const { data } = response;
        if (data?.status === 200 && data.message_txt === "Success") {
          const parsedData = JSON.parse(data.data); // Parse the JSON string
          const paymentUrl = parsedData.url; // Extract the URL
          setPaymentLink(paymentUrl);
          toast.success("Payment Link Generated Successfully..!");
        } else {
          toast.error(`${data?.message_txt}`);
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
        <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded-md shadow-lg top-full mt-1">
          {copySuccess ? "Copied!" : "Copy to Clipboard"}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col mx-3 my-10">
      <h2 className="text-base text-start tracking-wider font-medium">
        Online Payment
      </h2>
      <div className="flex flex-col max-w-sm justify-start">
        <div className="flex flex-col items-start">
          <input
            id="pay-checkbox"
            type="checkbox"
            className="hidden peer"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <label
            htmlFor="pay-checkbox"
            className={`flex w-8 h-8 my-3 p-4  justify-center shadow-inner text-gray-500 bg-slate-100 border border-red-500 rounded cursor-pointer 
            peer-checked:border-blue-600 peer-checked:bg-gradient-to-t from-blue-700 to-blue-600 peer-checked:text-white hover:text-gray-600 hover:bg-gray-100`}
          >
            {" "}
            <div className="flex items-center text-lg font-semibold capitalize">
              {isChecked ? "Yes" : ""}{" "}
            </div>
          </label>
          <span className="text-lg font-bold font-serif">
            I confirm the payment details.
          </span>
          <div className="flex justify-between  items-center mt-8">
            <button
              className={`transition-all text-lg bg-green-600 text-white font-mono font-bold px-4 py-1.5 mr-5 rounded-md border-green-700 border-b-[4px] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:border-b-[2px] active:brightness-90 active:translate-y-[2px] active:text-black`}
              onClick={() => {
                if (paymentLink) {
                  window.open(paymentLink, "_blank"); // Open payment link in a new tab
                }
              }}
              disabled={!isChecked || !paymentLink} // Disable if unchecked or no link
            >
              Make Payment
            </button>
            {PaymentLinkButton({ paymentLink })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentTaig;
