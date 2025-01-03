/* eslint-disable react/prop-types */
// Navbar component with token handling and session management
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TimerForAllUser from "../../Timer/TimerForAllUser.jsx";
import { useAppContext } from "../../../context/Context.jsx";

function Navbar({
  selectedOption,
  setSelectedOption,
  setMenuItems,
  selectedSubOption,
}) {
  const { state } = useAppContext();
  const [timer, setTimer] = useState(); // Default to 30 minutes
  const intervalRef = useRef(null); // To track the timer
  const location = useLocation();
  const navigate = useNavigate();
  const { subCats } = location.state || {};
console.log(subCats);

  useEffect(() => {
    const storedOption = sessionStorage.getItem("selectedOption");
    if (storedOption) {
      setSelectedOption(storedOption);
    }
  }, [setSelectedOption]);

  // Start and manage the timer when a token is received
  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalRef.current);
          // handleSessionExpiry();
          return 0;
        }
        return prevTimer;
      });
    }, 1000);
  };

  useEffect(() => {
    const checkToken = () => {
      const auth_token_received_at = sessionStorage.getItem(
        "auth_token_received_at"
      );
      if (auth_token_received_at) {
        const currentTime = Date.now();
        const tokenAge = Math.floor(
          (currentTime - parseInt(auth_token_received_at, 10)) / 1000
        );
        const remainingTime = Math.max(1800 - tokenAge, 0); // 30 minutes (1800 seconds)
        if (remainingTime > 0) {
          setTimer(remainingTime);
          startTimer();
        }
      }
    };

    // const handleSessionExpiry = () => {
    //   sessionStorage.removeItem("auth_access_token");
    //   sessionStorage.removeItem("auth_expires_in");
    //   sessionStorage.removeItem("auth_token_received_at");
    //   sessionStorage.removeItem("uat_access_token");
    //   sessionStorage.removeItem("uat_expires_in");
    //   sessionStorage.removeItem("uat_token_received_at");
    //   navigate("/advisor/home/insurance");
    // };

    checkToken(); // Check token on mount
  }, [navigate, selectedOption]);

    // Retrieve and set initial data from sessionStorage
    useEffect(() => {
      const savedOption = sessionStorage.getItem("selectedOption");
      if (savedOption) {
        setSelectedOption(savedOption);
        if (subCats && subCats[savedOption]) {
          const items = Object.values(subCats[savedOption]);
          setMenuItems(items);
        }
      }
    }, [subCats]);
  

  const handleSelectChange = (event) => {
    const selectedCategory = event.target.value;   
    setSelectedOption(selectedCategory);
    sessionStorage.setItem("selectedOption", selectedCategory);
    if (subCats && subCats[selectedCategory]) {
      const items = Object.values(subCats[selectedCategory]);
      setMenuItems(items);
    } else {
      setMenuItems([]);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center p-2 ">
        <div className="text-xl font-bold">
          <img
            className="md:w-20 md:h-20 w-16 h-16 shadow-inner"
            src={state.tata.privateCar.controller.image}
            alt={state.tata.privateCar.controller.insuranceName}
          />
        </div>
        <div className="container-flex flex justify-between tracking-wide">
          {subCats && (
            <select
              value={selectedOption}
              onChange={handleSelectChange}
              className="items-center cursor-pointer border-none text-base md:text-inherit font-semibold md:p-1.5 p-1 shadow-inner text-gray-500 bg-slate-100 rounded  hover:text-gray-600 hover:bg-gray-100"
            >
              <option value="">Select Insurance</option>
              {Object.keys(subCats).map((subCat, index) => (
                <option key={index} value={subCat} className="capitalize">
                  {subCat}
                </option>
              ))}
            </select>
          )}
        </div>
        {selectedSubOption ? (
          <TimerForAllUser currentTime={timer} />
        ) : (
          <div> </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
