/* eslint-disable react/prop-types */
import { useState } from "react";
import Data from "../../Data.jsx";

function Proposer({ onSubmit, quoteResponses, financier }) {
  const [errors, setErrors] = useState({});
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const quote = quoteResponses[0].data;
  // const quote2 = quoteResponses[0];

  const [formData, setFormData] = useState({
    proposer_gender: "",
    proposer_marital: "",
    proposer_fname: "",
    proposer_mname: "",
    proposer_lname: "",
    proposer_email: "",
    proposer_mobile: quote.mobile_no || "",
    proposer_salutation: "",
    proposer_add1: "",
    proposer_add2: "",
    proposer_add3: "",
    proposer_occupation: "",
    proposer_occupation_other: "",
    proposer_pan: "",
    proposer_annual: "",
    proposer_gstin: "",
    proposer_dob: "",
    vehicle_puc_expiry: "",
    vehicle_puc: "",
    vehicle_puc_declaration: "",
    pre_insurer_name: "",
    pre_insurer_no: "",
    financier_type: "",
    financier_name: "",
    nominee_name: "",
    nominee_relation: "",
    nominee_age: 0, // Assuming this is a number, default to 0
    appointee_name: "",
    appointee_relation: "",
    proposal_id: quote.proposal_id || "",
    product_id: quote.product_id || "",
    declaration: "",
    vehicle_chassis: "",
    vehicle_engine: "",
    proposer_fullname: "",
    proposer_pincode: quote.proposer_pincode || "",
    quote_no: quote.quote_no || "",
    carriedOutBy: "",
    __finalize: "",
  });
  // Calculate 18 years ago date
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const validatePAN = (pan) => {
    // Regex for PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    // if (!pan) {
    //   return "PAN is required.";
    // }
    if (!panRegex.test(pan)) {
      return "Invalid PAN format (ABCDE1234F)!";
    }
    return ""; // No error
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    let isValid = true;

    if (stepNumber === 1) {
      if (!formData.proposer_gender) {
        newErrors["proposer_gender"] = "required";
        isValid = false;
      }
      if (!formData.proposer_occupation) {
        newErrors["proposer_occupation"] = "required";
        isValid = false;
      }
      if (!formData.proposer_marital) {
        newErrors["proposer_marital"] = "required";
        isValid = false;
      }
      if (!formData.proposer_add1) {
        newErrors["proposer_add1"] = "required";
        isValid = false;
      }
      if (!formData.proposer_add2) {
        newErrors["proposer_add2"] = "required";
        isValid = false;
      }
      // if (!formData.nominee_name) {
      //   newErrors["nominee_name"] = "required";
      //   isValid = false;
      // }
      // if (!formData.nominee_relation) {
      //   newErrors["nominee_relation"] = "required";
      //   isValid = false;
      // }
      // if (!formData.nominee_age) {
      //   newErrors["nominee_age"] = "required";
      //   isValid = false;
      // }
    } else if (stepNumber === 2) {
      if (!formData.declaration) {
        newErrors["declaration"] = "required";
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };
  const [step, setStep] = useState(1);
  const [stepsCompleted, setStepsCompleted] = useState([
    false,
    false,
    false,
    false,
  ]);

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 2) {
        setStep((prevStep) => prevStep + 1);
        setStepsCompleted((prev) => {
          const newCompleted = [...prev];
          newCompleted[step - 1] = true;
          return newCompleted;
        });
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "proposer_pan") {
      const updatedValue = value.toUpperCase().slice(0, 10);
      setFormData((prevData) => ({
        ...prevData,
        [name]: updatedValue,
      }));
      // Validate PAN dynamically
      const error = validatePAN(updatedValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    } else if (name === "proposer_occupation") {
      const updatedValue = value.toUpperCase();
      setFormData((prevData) => ({
        ...prevData,
        [name]: updatedValue,
      }));
    } else if (name === "nominee_age") {
      setFormData({
        ...formData,
        [name]: Number(value),
      });
    } else if (name === "declaration") {
      // Ensure the value is set to "Yes" when checked, otherwise empty
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked ? "Yes" : "",
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-2">
            <div className="grid md:grid-cols-6 grid-cols-2 text-sm md:text-base text-gray-500 justify-items-stretch p-2 gap-8 rounded">
              <div className="flex flex-col">
                <h1 className="text-sm text-start md:text-base font-semibold space-x-2 md:space-x-4">
                  Policy ID
                  <span className="text-red-500 font-extrabold"> *</span>
                </h1>
                <div className="flex flex-wrap">
                  <input
                    type="text"
                    name="policy_id"
                    value={quote.policy_id}
                    className="items-center text-base md:text-inherit shadow-inner p-1.5 bg-gray-200 font-semibold rounded border-none"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <h1 className="text-sm text-start md:text-base font-semibold space-x-2">
                  Salutation
                  {/* <span className="text-red-500 font-extrabold"> *</span> */}
                </h1>
                <div className="flex">
                  <select
                    name="proposer_salutation"
                    value={formData.proposer_salutation}
                    onChange={handleChange}
                    className={`items-center border-none text-base md:text-inherit font-semibold p-1.5 shadow-inner text-gray-500 bg-slate-100 rounded cursor-pointer  hover:text-gray-600 hover:bg-gray-100`}
                  >
                    <option className="font-semibold" value="">
                      Select Title
                    </option>
                    {Data.titles.map((title, idx) => (
                      <option key={idx} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex col-span-2">
                <div className="flex flex-col">
                  <h1 className="text-sm text-start md:text-base font-semibold space-x-2 md:space-x-2 md:px-3">
                    F Name
                    <span className="text-red-500 font-extrabold"> *</span>
                  </h1>
                  <div className="flex p-1 md:px-3">
                    <input
                      name="proposer_fname"
                      type="text"
                      value={formData.proposer_fname}
                      onChange={handleChange}
                      className={`${
                        errors["proposer_fname"]
                          ? "border-red-500"
                          : "border-none"
                      } items-cente w-5/6 text-base md:text-lg p-1 shadow-inner  bg-slate-100 rounded  hover:text-gray-600 hover:bg-gray-100`}
                    />
                  </div>
                  {errors["proposer_fname"] && (
                    <p className="text-red-500 text-sm text-start  md:text-base md:px-4">
                      {errors["proposer_fname"]}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <h1 className="text-sm text-start md:text-base font-semibold space-x-2 md:space-x-2 md:px-3">
                    M Name
                    {/* <span className="text-red-500 font-extrabold"> *</span> */}
                  </h1>
                  <div className="flex p-1 md:px-3">
                    <input
                      name="proposer_mname"
                      type="text"
                      value={formData.proposer_mname}
                      onChange={handleChange}
                      className={`${
                        errors["proposer_mname"]
                          ? "border-red-500"
                          : "border-none"
                      } items-center w-5/6 text-base md:text-lg md:p-1 p-1 shadow-inner  bg-slate-100 rounded  hover:text-gray-600 hover:bg-gray-100`}
                    />
                  </div>
                  {errors["proposer_mname"] && (
                    <p className="text-red-500 text-sm text-start  md:text-base md:px-4">
                      {errors["proposer_mname"]}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <h1 className="text-sm text-start md:text-base font-semibold space-x-2 md:space-x-2 md:px-3">
                    L Name
                    <span className="text-red-500 font-extrabold"> *</span>
                  </h1>
                  <div className="flex p-1 md:px-3">
                    <input
                      name="proposer_lname"
                      type="text"
                      value={formData.proposer_lname}
                      onChange={handleChange}
                      className={`${
                        errors["proposer_lname"]
                          ? "border-red-500"
                          : "border-none"
                      } items-center w-5/6 text-base md:text-lg md:p-1 p-1 shadow-inner  bg-slate-100 rounded hover:text-gray-600 hover:bg-gray-100`}
                    />
                  </div>
                  {errors["proposer_lname"] && (
                    <p className="text-red-500 text-sm text-start  md:text-base md:px-4">
                      {errors["proposer_lname"]}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-sm text-start md:text-base font-semibold space-x-2 md:space-x-2">
                  Email ID
                  <span className="text-red-500 font-extrabold"> *</span>
                </h1>
                <div className="flex">
                  <input
                    name="proposer_email"
                    type="email"
                    value={formData.proposer_email}
                    onChange={handleChange}
                    className={`${
                      errors["proposer_email"]
                        ? "border-red-500"
                        : "border-none"
                    } items-center  text-base md:text-lg md:p-1 p-1 shadow-inner  bg-slate-100 rounded   hover:text-gray-600 hover:bg-gray-100`}
                  />
                </div>
                {errors["proposer_email"] && (
                  <p className="text-red-500 text-sm text-start  md:text-base md:px-4">
                    {errors["proposer_email"]}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <h1 className="text-sm text-start md:text-base font-semibold space-x-2 md:space-x-4">
                  Mobile No.
                  <span className="text-red-500 font-extrabold"> *</span>
                </h1>
                <div className="flex flex-wrap">
                  <input
                    type="text"
                    name="proposer_mobile"
                    value={formData.proposer_mobile}
                    className="items-center  text-base md:text-inherit shadow-inner p-1.5 bg-gray-200 font-semibold rounded border-none"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <h1 className="text-sm text-start md:text-base font-semibold space-x-2 ">
                  Gender
                  <span className="text-red-500 font-extrabold"> *</span>
                </h1>
                <div className="flex">
                  <select
                    name="proposer_gender"
                    value={formData.proposer_gender}
                    onChange={handleChange}
                    className={`${
                      errors["proposer_gender"]
                        ? "border-red-500 text-red-500"
                        : "border-none"
                    }items-center text-base md:text-inherit font-semibold md:p-1 p-1 ps-2 shadow-inner text-gray-500 bg-slate-100 rounded cursor-pointer  hover:text-gray-600 hover:bg-gray-100`}
                  >
                    <option className="font-semibold" value="">
                      Select Gender
                    </option>

                    {Data.gender.map((plan, idx) => (
                      <option key={idx} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                </div>
                {errors["proposer_gender"] && (
                  <p className="text-red-500 text-sm text-start  md:text-base">
                    {errors["proposer_gender"]}
                  </p>
                )}
              </div>
              <div>
                <h1 className="text-sm text-start md:text-base font-semibold space-x-2 ">
                  Martial Status
                  <span className="text-red-500 font-extrabold"> *</span>
                </h1>
                <div className="flex">
                  <select
                    name="proposer_marital"
                    value={formData.proposer_marital}
                    onChange={handleChange}
                    className={`${
                      errors["proposer_marital"]
                        ? "border-red-500 text-red-500"
                        : "border-none"
                    }text-base md:text-lg p-1 shadow-inner bg-slate-100 rounded hover:text-gray-600 hover:bg-gray-100`}
                  >
                    <option className="font-semibold" value="">
                      Select Status
                    </option>
                    {Data.marital_status.map((plans, idx) => (
                      <option key={idx} value={plans}>
                        {plans}
                      </option>
                    ))}
                  </select>
                </div>
                {errors["proposer_marital"] && (
                  <p className="text-red-500 text-sm text-start md:text-base">
                    {errors["proposer_marital"]}
                  </p>
                )}
              </div>
              <div>
                <h1 className="text-sm text-start md:text-base font-semibold space-x-2">
                  DOB
                  <span className="text-red-500 font-extrabold">*</span>
                </h1>
                <div className="flex">
                  <input
                    name="proposer_dob"
                    type="date"
                    max={eighteenYearsAgo}
                    value={formData.proposer_dob}
                    onChange={handleChange}
                    className={`${
                      errors["proposer_dob"] ? "border-red-500" : "border-none"
                    }
                      items-center  text-base md:text-inherit font-semibold p-1.5 shadow-inner text-gray-500 bg-slate-100 rounded cursor-pointer  hover:text-gray-600 hover:bg-gray-100`}
                  />
                </div>
                {errors["proposer_dob"] && (
                  <p className="text-red-500 text-sm text-start  md:text-base md:px-4">
                    {errors["proposer_dob"]}
                  </p>
                )}
              </div>

              <div>
                <h1 className="text-sm text-start md:text-base space-x-2 font-semibold">
                  Occupation
                  <span className="text-red-500 font-extrabold"> *</span>
                </h1>
                <div className="flex">
                  <select
                    name="proposer_occupation"
                    value={formData.proposer_occupation}
                    onChange={handleChange}
                    className={`${
                      errors["proposer_occupation"]
                        ? "border-red-500 text-red-500"
                        : "border-none"
                    }flex md:w-60 items-center text-base md:text-inherit font-semibold md:p-1 p-1 ps-2 shadow-inner text-gray-500 bg-slate-100 rounded cursor-pointer  hover:text-gray-600 hover:bg-gray-100`}
                  >
                    <option className="font-semibold" value="">
                      Select Occupation
                    </option>
                    {Data.occupation.map((ocp, idx) => (
                      <option key={idx} value={ocp}>
                        {ocp}
                      </option>
                    ))}
                  </select>
                </div>
                {errors["proposer_occupation"] && (
                  <p className="text-red-500 text-sm text-start  md:text-base ">
                    {errors["proposer_occupation"]}
                  </p>
                )}
              </div>

              {formData.proposer_occupation === "OTHER" && (
                <div>
                  <h1 className="text-sm text-start md:text-base font-semibold space-x-2">
                    Occupation
                  </h1>
                  <div className="flex">
                    <input
                      name="proposer_occupation_other"
                      type="text"
                      min={1700}
                      max={2100}
                      value={formData.proposer_occupation_other}
                      onChange={handleChange}
                      className={`items-center text-base md:text-inherit font-semibold p-1 border-none shadow-inner text-gray-500 bg-slate-100 rounded cursor-pointer  hover:text-gray-600 hover:bg-gray-100`}
                    />
                  </div>
                </div>
              )}

              {[
                "quote_no",
                "proposal_id",
                "product_id",
                "proposer_add1",
                "proposer_add2",
                "proposer_add3",
                "proposer_pincode",
                "proposer_pan", // Include PAN in the inputs list
                "proposer_annual",
                "proposer_gstin",
                "vehicle_chassis",
                "vehicle_engine",
                "vehicle_puc_expiry",
                "vehicle_puc",
                "vehicle_puc_declaration",
                "nominee_name",
                "nominee_age",
              ].map((pro, index) => (
                <div key={index} className="flex flex-col mb-4">
                  <h1 className="text-sm text-start md:text-base font-medium space-x-2 md:space-x-4">
                    {pro
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </h1>
                  <div className="flex">
                    <input
                      name={pro}
                      type="text"
                      value={formData[pro]}
                      onChange={handleChange}
                      readOnly={[
                        "quote_no",
                        "proposal_id",
                        "product_id",
                        "proposer_mobile",
                        "proposer_pincode",
                      ].includes(pro)}
                      className={`items-center border text-base md:text-inherit p-1.5 shadow-inner rounded ${
                        [
                          "quote_no",
                          "proposal_id",
                          "product_id",
                          "proposer_mobile",
                          "proposer_pincode",
                        ].includes(pro)
                          ? "bg-gray-200 font-semibold"
                          : "bg-slate-100"
                      } ${
                        pro === "proposer_pan" ||
                        pro === "nominee_name" ||
                        (pro === "nominee_age" && errors[pro])
                          ? "border-red-500 text-red-500"
                          : "border-none"
                      }`}
                    />
                  </div>
                  {errors[pro] && (
                    <p className="text-red-500 text-sm text-start md:text-base">
                      {errors[pro]}
                    </p>
                  )}
                </div>
              ))}

              <div>
                <h1 className="text-sm text-start md:text-base space-x-2 font-semibold">
                  Nominee Relation
                  <span className="text-red-500 font-extrabold"> *</span>
                </h1>
                <div className="flex">
                  <select
                    name="nominee_relation"
                    value={formData.nominee_relation}
                    onChange={handleChange}
                    className={`${
                      errors["nominee_relation"]
                        ? "border-red-500 text-red-500"
                        : "border-none"
                    }items-center md:w-4/5 text-base md:text-inherit font-semibold md:p-1 p-1 ps-2 shadow-inner text-gray-500 bg-slate-100 rounded cursor-pointer  hover:text-gray-600 hover:bg-gray-100`}
                  >
                    <option className="font-semibold" value="">
                      Select Relation
                    </option>
                    {Data.nomineeRelationships.map((ocp, idx) => (
                      <option key={idx} value={ocp}>
                        {ocp}
                      </option>
                    ))}
                  </select>
                </div>
                {errors["nominee_relation"] && (
                  <p className="text-red-500 text-sm text-start  md:text-base md:px-4">
                    {errors["nominee_relation"]}
                  </p>
                )}
              </div>

              <div>
                <h1 className="text-sm text-start md:text-base space-x-2 font-semibold">
                  Financier Type
                  <span className="text-red-500 font-extrabold"> *</span>
                </h1>
                <div className="flex">
                  <select
                    name="financier_type"
                    value={formData.financier_type}
                    onChange={handleChange}
                    className={`${
                      errors["financier_type"]
                        ? "border-red-500 text-red-500"
                        : "border-none"
                    }items-center md:w-4/5 text-base md:text-inherit font-semibold md:p-1 p-1 ps-2 shadow-inner text-gray-500 bg-slate-100 rounded cursor-pointer  hover:text-gray-600 hover:bg-gray-100`}
                  >
                    <option className="font-semibold" value="">
                      Select Financier
                    </option>
                    {Data.financier_types.map((ocp, idx) => (
                      <option key={idx} value={ocp}>
                        {ocp}
                      </option>
                    ))}
                  </select>
                </div>
                {errors["financier_type"] && (
                  <p className="text-red-500 text-sm text-start  md:text-base md:px-4">
                    {errors["financier_type"]}
                  </p>
                )}
              </div>

              <div>
                <h1 className="text-sm text-start md:text-base space-x-2 font-semibold">
                  Financier Name
                  <span className="text-red-500 font-extrabold"> *</span>
                </h1>
                <div className="flex">
                  <select
                    name="financier_name"
                    value={formData.financier_name}
                    onChange={handleChange}
                    className={`${
                      errors["financier_name"]
                        ? "border-red-500 text-red-500"
                        : "border-none"
                    }items-center md:w-4/5 text-base md:text-inherit font-semibold md:p-1 p-1 ps-2 shadow-inner text-gray-500 bg-slate-100 rounded cursor-pointer  hover:text-gray-600 hover:bg-gray-100`}
                  >
                    <option className="font-semibold" value="">
                      Select Name
                    </option>
                    {financier
                      .sort((a, b) =>
                        a.txt_financier_name.localeCompare(b.txt_financier_name)
                      )
                      .map((data) => (
                        <option
                          key={data.num_financier_cd}
                          value={data.txt_financier_name}
                        >
                          {data.txt_financier_name}
                        </option>
                      ))}
                  </select>
                </div>
                {errors["financier_name"] && (
                  <p className="text-red-500 text-sm text-start  md:text-base md:px-4">
                    {errors["financier_name"]}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <div className="grid lg:grid-cols-6 grid-cols-2 text-sm md:text-base text-gray-500 p-2 gap-8 rounded">
              {[
                "pre_insurer_name",
                "pre_insurer_no",
                "appointee_name",
                "appointee_relation",
              ]
                .filter((data) => {
                  // Show only pre_insurer_name and pre_insurer_no if the condition matches
                  if (
                    quote.business_type === "Rollover" &&
                    quote.business_type_no === "03"
                  ) {
                    return (
                      data === "pre_insurer_name" || data === "pre_insurer_no"
                    );
                  }
                  // Otherwise, exclude pre_insurer_name and pre_insurer_no
                  return (
                    data !== "pre_insurer_name" && data !== "pre_insurer_no"
                  );
                })
                .map((data, idx) => (
                  <div key={idx} className="flex flex-col mb-4">
                    <h1 className="text-sm text-start md:text-base font-medium space-x-2 md:space-x-4 pb-0.5">
                      {data
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </h1>
                    <div className="flex">
                      <input
                        name={data}
                        type="text"
                        value={formData[data]}
                        onChange={handleChange}
                        placeholder={data
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                        className="items-center border-none text-base md:text-inherit p-1.5 shadow-inner bg-slate-100 rounded hover:text-gray-600 hover:bg-gray-100"
                      />
                    </div>
                  </div>
                ))}

              {["carriedOutBy"].map((data, idx) => (
                <div key={idx} className="flex flex-col mb-2">
                  <h1 className="text-sm text-start md:text-base font-semibold space-x-2 md:space-x-4 md:px-4 ">
                    {/* {field.replace(/_/g, " ")} */}
                    {data
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </h1>
                  <div className="flex p- md:px-3">
                    <select
                      name={data}
                      type="text"
                      value={formData[data]}
                      onChange={handleChange}
                      className="items-center border-none cursor-pointer text-base md:text-inherit  p-1.5 shadow-inner bg-slate-100 rounded hover:text-gray-600 hover:bg-gray-100"
                    >
                      <option key={idx} value="">
                        Select{" "}
                        {data
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </option>
                      {["Yes", "No"].map((opt, index) => (
                        <option key={index} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-start mx-2">
              <input
                type="checkbox"
                name="declaration"
                id="declaration-checkbox"
                className="hidden peer"
                checked={formData.declaration === "Yes"}
                onChange={handleChange}
              />
              <label
                htmlFor="declaration-checkbox"
                className={`${
                  errors["declaration"] ? "border-red-500" : ""
                } flex w-6 h-6 my-auto mr-4 justify-center  shadow-inner text-gray-500 bg-slate-100 border border-red-500 rounded cursor-pointer peer-checked:border-blue-600 peer-checked:bg-gradient-to-t from-blue-700 to-blue-600 peer-checked:text-white hover:text-gray-600 hover:bg-gray-100`}
              >
                <div className=" text-xs my-auto font-semibold capitalize">
                  {formData.declaration}
                </div>
              </label>{" "}
              <span className="my-auto text-lg font-bold font-serif">
                I declare that I provide correct details.
              </span>
            </div>
          </div>
        );
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    onSubmit(formData); // Pass data to the parent component
  };

  const handleConvert = () => {
    setFormData({ ...formData, __finalize: "1" });
    setShowConfirmation(true);
  };

  // SAVE QUOTES
  const handleSave = async () => {
    setFormData({ ...formData, __finalize: "0" });
    setShowConfirmSave(true);
  };

  const confirmFinalize = () => {
    handleSubmit();
    // Form conversion is confirmed
    setShowConfirmation(false);
  };

  const confirmSave = () => {
    handleSubmit();
    // Form conversion is confirmed
    setShowConfirmSave(false);
  };

  return (
    <>
      <div className="max-w-full border shadow-inner md:p-4 p-2 tracking-wide bg-slate-50  isolation-auto border-none Z-10  relative rounded group">
        <div className={`${step > 1 ? "mb-6" : "mb-8"}`}>
          <div className="flex justify-between items-center">
            <span className="md:text-lg text-sm">Step {step} of 2</span>
            <h2 className="md:text-2xl text-base bg-gradient-to-l bg-clip-text from-indigo-600 to-blue-500 font-bold">
              {step > 2 ? "Proposer Preview" : "Proposer Information"}
            </h2>
            <div className="flex space-x-2">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`md:w-6 w-2 md:h-1.5 h-1  ${
                    s === step
                      ? "bg-blue-600"
                      : stepsCompleted[s - 1]
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {renderStep()}
      </div>
      <div className="my-4 flex justify-between">
        <button
          type="button"
          className={`${
            step === 1 && "cursor-not-allowed"
          } flex justify-center gap-2 items-center shadow-xl text-lg z-0 bg-slate-100 backdrop-blur-md lg:font-semibold isolation-auto border-none before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded before:bg-red-700 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative  md:px-8 md:py-2 px-3 py-1 overflow-hidden rounded group`}
          onClick={handlePrevious}
          disabled={step === 1}
        >
          Previous
        </button>
        {step < 2 ? (
          <button
            type="button"
            className="flex justify-center gap-2 items-center shadow-xl text-lg bg-slate-100 backdrop-blur-md lg:font-semibold isolation-auto border-none before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded before:bg-blue-700 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 md:px-8 md:py-2 px-3 py-1  overflow-hidden rounded group"
            onClick={handleNext}
          >
            Next
          </button>
        ) : (
          <div className="flex justify-between space-x-5">
            <button
              onClick={handleSave}
              className="flex justify-center gap-2 items-center shadow-xl text-lg bg-slate-100 active:translate-y-[2px] backdrop-blur-md lg:font-semibold isolation-auto border-none before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded before:bg-blue-700 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative md:px-8 md:py-2 px-3 py-1  overflow-hidden rounded group"
              type="submit"
            >
              Save
            </button>
            <button
              onClick={handleConvert}
              className="flex justify-center gap-2 border-b-[4px] active:border-b-[2px]  active:translate-y-[2px] items-center shadow-xl text-lg bg-slate-100 backdrop-blur-md lg:font-semibold isolation-auto border-none before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded before:bg-green-800 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative md:px-8 md:py-2 px-3 py-1  overflow-hidden rounded group"
              type="submit"
            >
              Submit
            </button>
          </div>
        )}
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-8">
              {`Are you sure you want to `}
              <span className="text-blue-600 font-medium">_finalize</span>
              {` ${formData.proposer_fname} ${formData.proposer_lname} proposal?`}
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
          </div>
        </div>
      )}

      {showConfirmSave && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg mb-8">
              {`Are you sure you want to `}
              <span className="text-blue-600 font-medium">save</span>
              {` ${formData.proposer_fname} ${formData.proposer_lname} proposal?`}
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300  cursor-pointer transition-all text-black font-mono font-bold px-6 py-1 rounded-lg
              border-gray-400
                border-b-[4px] hover:brightness-110  
                active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                onClick={() => setShowConfirmSave(false)}
              >
                No
              </button>
              <button
                className=" cursor-pointer transition-all bg-blue-500 text-white font-mono font-bold px-6 py-1 rounded-lg
              border-blue-600
                border-b-[4px] hover:brightness-110 
                active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                onClick={confirmSave} // Set formData.__finalize to "1"
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

export default Proposer;
