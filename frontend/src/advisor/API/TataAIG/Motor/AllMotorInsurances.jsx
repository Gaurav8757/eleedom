import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Asidebar from "../../Asidebar/Asidebar.jsx";
import Navbar from "../../Navbar/Navbar.jsx";
import QuoteForm from "../Quoteform/QuoteForm.jsx";
import Proposer from "../Proposer/Proposer.jsx";
import VITE_DATA from "../../../../config/config.jsx";
import PvtCkyc from "../TataCkyc/PAN/PvtCkyc.jsx";
import FormSixty from "../Form60/FormSixty.jsx";
import { useAppContext } from "../../../../context/Context.jsx";
import PopupAllKyc from "../TataCkyc/PopupAllKyc.jsx";

function AllMotorInsurances() {
  const { state, dispatch } = useAppContext();
  const [selectedOption, setSelectedOption] = useState("");
  const [showProposer, setShowProposer] = useState(false);
  const [showCkyc, setShowCkyc] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(true);
  const [menuItems, setMenuItems] = useState({});
  const [selectedSubOption, setSelectedSubOption] = useState("");
  const [token, setToken] = useState("");
  const [uatToken, setUatToken] = useState("");
  const [vehMake, setVehMake] = useState([]);
  const [model, setModel] = useState([]);
  const [variant, setVariant] = useState([]);
  const [rtolist, setRtoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [financier, setFinancier] = useState([]);
  const [formSixtyState, setFormSixtyState] = useState(false);
  const [isPopupKycOpen, setIsPopupKycOpen] = useState(true);

  const handleBackToQuote = () => {
    setShowQuoteForm(true);
    setShowProposer(false);
  };

  const handleBackToProposal = () => {
    setShowProposer(true);
    setShowCkyc(false);
  };
  const handleForwardToProposal = () => {
    setShowProposer(true);
    setShowQuoteForm(false);
  };

  const handleForwardToCkyc = () => {
    setShowProposer(false);
    setShowCkyc(true);
  };

  // Handle SubOption change
  const handleSubOptionChange = (index) => {
    const selectedOption = menuItems[index];
    sessionStorage.setItem("selectedSubOption", selectedOption.name);
    setSelectedSubOption(selectedOption.name);
    const authLink = selectedOption.authLink;

    // Make API call if needed
    if (authLink) {
      fetch(authLink)
        .then((response) => response.json())
        .then((data) => {
          const auth = data.auth;
          const uatMaster = data.uatLists.data;
          const currentTime = Date.now();
          if (auth.access_token && auth.expires_in) {
            setToken(auth.access_token);
            sessionStorage.setItem("auth_access_token", auth.access_token);
            sessionStorage.setItem("auth_expires_in", auth.expires_in);
            sessionStorage.setItem("auth_token_received_at", currentTime);
          }
          if (uatMaster.token) {
            setUatToken(uatMaster.token);
            // sessionStorage.setItem("uat_access_token", uatMaster.token);
            sessionStorage.setItem("uat_token_received_at", uatMaster.u_ts);
          }
          // handleSetAuthTokenToQuote();
          toast.success(`${data.message}`);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  // RTO LISTS => REG PLACE & CODE
  useEffect(() => {
    const fetchData = async () => {
      if (!uatToken) {
        return; // Exit if token is not present
      }
      try {
        const response = await axios.get(`${VITE_DATA}/taig/pc/rto`, {
          headers: {
            Authorization: `${uatToken}`, // Send the token in the Authorization header
          },
        });

        if (response.data.status === 0) {
          setRtoList(response.data?.data);
        } else {
          toast.error(response.data?.txt);
        }
      } catch (error) {
        console.error(error);
        toast.error(`${error.response?.data?.txt}`);
      }
    };
    fetchData();
  }, [uatToken]);

  //FINANCIER
  // RTO LISTS => REG PLACE & CODE
  useEffect(() => {
    const fetchData = async () => {
      if (!uatToken) {
        // toast.error("Not Authorized yet.. Try again!");
        return; // Exit if token is not present
      }
      try {
        const response = await axios.get(`${VITE_DATA}/taig/pc/financier`, {
          headers: {
            Authorization: `${uatToken}`, // Send the token in the Authorization header
          },
        });

        if (response.data.status === 0) {
          setFinancier(response.data?.data);
        } else {
          toast.error(response.data?.txt);
        }
      } catch (error) {
        console.error(error);
        toast.error(`${error.response?.data?.txt}`);
      }
    };
    fetchData();
  }, [uatToken]);

  // all 12 lists
  // 1. VEHICLE_MAKE
  useEffect(() => {
    const fetchData = async () => {
      if (!uatToken) {
        // toast.error("Not Authorized yet.. Try again!");
        return; // Exit if token is not present
      }
      try {
        const response = await axios.get(`${VITE_DATA}/taig/pc/mfg`, {
          headers: {
            Authorization: `${uatToken}`, // Send the token in the Authorization header
          },
        });
        if (response.data.status === 0) {
          setVehMake(response.data?.data);
        } else {
          toast.error(response.data?.txt);
        }
      } catch (error) {
        console.error(error);
        toast.error(`${error.response?.data?.txt}`);
      }
    };
    fetchData();
  }, [uatToken]);

  // Vehicle Model
  const handleSelectedModel = async (data) => {
    if (!uatToken) {
      // toast.error("Not Authorized yet.. Try again!");
      return; // Exit if token is not present
    }
    try {
      // send this data to variant data to get prices
      const response = await axios.get(
        `${VITE_DATA}/taig/pc/mfg/model/${data.code}/${data.name}`,
        {
          headers: {
            Authorization: `${uatToken}`, // Send the token in the Authorization header
          },
        }
      );
      if (response.data.status === 0) {
        setModel(response.data?.data);
      } else {
        toast.error(response.data?.txt);
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error.response?.data?.txt || "An error occurred"}`);
    }
  };

  // vehicle model variant
  const handleSelectedVariant = async (data) => {
    if (!uatToken) {
      // toast.error("Not Authorized yet.. Try again!");
      return; // Exit if token is not present
    }
    try {
      // setVariantToVariantData(data);
      const response = await axios.get(
        `${VITE_DATA}/taig/pc/mfg/model/variant/${data.code}/${data.name}`,
        {
          headers: {
            Authorization: `${uatToken}`, // Send the token in the Authorization header
          },
        }
      );
      if (response.data.status === 0) {
        setVariant(response.data?.data);
      } else {
        toast.error(response.data?.txt);
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error.response?.data?.txt || "An error occurred"}`);
    }
  };

  const handleRtoData = async (data) => {
    if (!uatToken) {
      // toast.error("Not Authorized yet.. Try again!");
      return; // Exit if token is not present
    }
    try {
      const response = await axios.get(
        `${VITE_DATA}/taig/pc/rto/${data.code}/${data.name}`,
        {
          headers: {
            Authorization: `${uatToken}`, // Send the token in the Authorization header
          },
        }
      );
      if (response.data.status === 0) {
        // setRtoData(response.data?.data);
        return response.data?.data;
      } else {
        toast.error(response.data?.txt);
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error.response?.data?.txt || "An error occurred"}`);
    }
  };

  useEffect(() => {
    // Simulate data
    const loadData = async () => {
      try {
        // Simulate an async operation, such as an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // When data is ready, set  to false
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // Fetch data and handle sessionStorage for state persistence
  useEffect(() => {
    const storedSubOption = sessionStorage.getItem("selectedSubOption");
    if (storedSubOption) {
      setSelectedSubOption(storedSubOption);
    }
  }, []);

  const handleSetAuthTokenToQuote = async (formData) => {
    const headers = {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    };
    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_DATA}/taig/motor/quote`,
        formData,
        {
          headers,
        }
      );
      if (response.data.status === 200) {
        toast.success(`${response.data.message_txt}`);
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_QUOTES",
          payload: response.data.data[0],
        });
        // Move to Proposer component on success
        if (
          response.data.message_txt ===
            "Quotation converted to proposal successfully" &&
          response.data.status === 200
        ) {
          setShowQuoteForm(false);
          setLoading(false);
          setShowProposer(true);
        }
      } else if (response.data.status === -102) {
        // Stay on QuoteForm for error status -102
        setLoading(false);
        toast.error(response.data.message_txt);
        setShowQuoteForm(true);
        setShowProposer(false);
      } else {
        setLoading(false);
        toast.error(`${response.data.message_txt || response.data.message}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message_txt || "Error to fetching quote response"
      );
      setLoading(false);
    }
  };

  const handleSetAuthTokenToProposal = async (formData) => {
    const headers = {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    };
    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_DATA}/taig/motor/proposal`,
        formData,
        {
          headers,
        }
      );
      if (response.data.status === 200) {
        toast.success(`${response.data.message_txt}`);
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_PROPOSER",
          payload: response.data.data[0],
        });
        if (
          response.data.message_txt === "Proposal submitted successfully" &&
          response.data.status === 200
        ) {
          setShowProposer(false);
          setLoading(false);
          setShowCkyc(true);
        }
      } else {
        toast.error(`${response.data.message_txt || response.data.message}`);
        setLoading(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message_txt ||
          "Error to fetching proposal response"
      );
      setLoading(false);
      // handleSessionExpiry();
    }
  };

  const handleSetAuthTokenToCkyc = async (formData) => {
    const newFormData = structuredClone(formData);
    if (formData.id_type === "PAN") {
      delete newFormData.req_id;
      delete newFormData.dob;
      delete newFormData.gender;
      const headers = {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      };
      setLoading(true);
      try {
        const response = await axios.post(
          `${VITE_DATA}/taig/motor/ckyc`,
          newFormData,
          {
            headers,
          }
        );
        if (response.data.status === 200) {
          toast.success(`${response.data.message_txt}`);
          dispatch({
            type: "SET_TATA_PRIVATE_CAR_CKYC",
            payload: response.data.data,
          });
          setLoading(false);
        } else if (
          response.data.status === 400 &&
          response.data.message_txt ===
            "CKYC not completed. Please retry with another id"
        ) {
          setLoading(false);
          toast.error(`${response.data.message_txt}`);
        } else {
          setLoading(false);
          toast.error(`${response.data.message_txt || response.data.message}`);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message_txt || "Error to complete cKYC"
        );
        setLoading(false);
        // handleSessionExpiry();
      }
    }
  };

  const handleFormSixty = async (formData) => {
    const headers = {
      Authorization: `${token}`,
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
      if (
        response.data.status === 200 &&
        response.data.message_txt === "Succesfully uploaded"
      ) {
        toast.success(`${response.data.message_txt}`);
        setLoading(false);
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_FORM60",
          payload: response.data.data,
        });
      } else {
        setLoading(false);
        toast.error(`${response.data.message_txt || response.data.message}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message_txt || "Error to upload Form60"
      );
      setLoading(false);
      // handleSessionExpiry();
    }
  };
  // console.log(ckycResponses);

  // const handleSessionExpiry = () => {
  //   sessionStorage.removeItem("auth_access_token");
  //   sessionStorage.removeItem("auth_expires_in");
  //   sessionStorage.removeItem("auth_token_received_at");
  //   sessionStorage.removeItem("uat_access_token");
  //   sessionStorage.removeItem("uat_expires_in");
  //   sessionStorage.removeItem("uat_token_received_at");
  //   navigate("/advisor/home/insurance");
  // };

  return (
    <>
      {" "}
      {loading ? (
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
      ) : (
        <>
          {" "}
          <Navbar
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            setMenuItems={setMenuItems}
            selectedSubOption={selectedSubOption}
          />
          <Asidebar />
        </>
      )}
      <main className="md:mt-28 mt-16 flex flex-col ml-20 mr-2 ">
        {/* {selectedOption && (
          <VehicleRegistrationNo
            Check={<Check className="font-bold" />}
            MoveRight={<MoveRight width={20} />}
          />
            )}  */}
        {/* quotes */}
        {loading ? (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg text-center">
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
            </div>
          </div>
        ) : (
          selectedOption &&
          showQuoteForm && (
            <>
              {" "}
              {state.tata.privateCar.proposer.verified && (
                <button
                  onClick={handleForwardToProposal}
                  type="button"
                  className="flex text-white bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {" "}
                  <span className="px-2">Forward to Proposal</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0l-4 4m4-4l-4-4"
                    />
                  </svg>
                </button>
              )}
              <QuoteForm
                onSubmit={(data) => {
                  handleSetAuthTokenToQuote(data);
                }}
                handle={handleSubOptionChange}
                vehMake={vehMake}
                model={model}
                variant={variant}
                rtolist={rtolist}
                onSelectedVeh={handleSelectedModel}
                onSelectedModel={handleSelectedVariant}
                handleRtoData={handleRtoData}
              />
            </>
          )
        )}

        {/* proposer */}
        {loading ? (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg text-center">
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
            </div>
          </div>
        ) : (
          showProposer && (
            <>
              <div className="flex  justify-between mb-3">
                <button
                  onClick={handleBackToQuote}
                  type="button"
                  className="flex text-white bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 5H1m0 0l4-4M1 5l4 4"
                    />
                  </svg>
                  <span className="px-2">Back to Quote</span>
                </button>
                {state.tata.privateCar.ckyc.verified && (
                  <button
                    onClick={handleForwardToCkyc}
                    type="button"
                    className="flex text-white bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    {" "}
                    <span className="px-2">Forward to CKYC</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0l-4 4m4-4l-4-4"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <Proposer
                onSubmit={handleSetAuthTokenToProposal}
                token={uatToken}
                financier={financier}
              />
            </>
          )
        )}

        {loading ? (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg text-center">
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
            </div>
          </div>
        ) : (
          showCkyc && (
            <>
              <div className="flex mb-3">
                <button
                  onClick={handleBackToProposal}
                  type="button"
                  className="flex text-white bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 5H1m0 0l4-4M1 5l4 4"
                    />
                  </svg>
                  <span className="px-2">Back to Proposal</span>
                </button>
              </div>
              <PvtCkyc
                onSubmit={handleSetAuthTokenToCkyc}
                token={token}
                setFormSixtyState={setFormSixtyState}
              />
            </>
          )
        )}

        {/* form 60 */}
        {formSixtyState && (
          <FormSixty
            onSubmitFormSixty={handleFormSixty}
            setFormSixtyState={setFormSixtyState}
          />
        )}

        {/* on successful responses form60 context get open popup */}
        <PopupAllKyc
          isOpen={state.tata.privateCar.form60.success && isPopupKycOpen}
          token={token}
          toggleModal={() => setIsPopupKycOpen(false)}
        />
      </main>
    </>
  );
}
export default AllMotorInsurances;
