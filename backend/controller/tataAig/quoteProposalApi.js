import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
const {
  TATA_AIG_4_WHEELER_QUOTE_URL,
  TATA_AIG_4_WHEELER_PROPOSAL_URL,
  TATA_AIG_4_WHEELER_MANUFACTURER,
  TATA_AIG_4_WHEELER_MANUFACTURER_MODEL,
  TATA_AIG_4_WHEELER_MANUFACTURER_MODEL_VARIANT,
  TATA_AIG_4_WHEELER_MANUFACTURER_MODEL_VARIANT_PRICEDATA,
  TATA_AIG_4_WHEELER_RTO,
  TATA_AIG_4_WHEELER_RTO_BY_CODE,
  TATA_AIG_4_WHEELER_PINCODE,
  TATA_AIG_4_WHEELER_PREV_INSURER,
  TATA_AIG_4_WHEELER_FINANCIER,
  TATA_AIG_4_WHEELER_POLICY_PLAN,
  TATA_AIG_4_WHEELER_CKYC_URL,
  TATA_AIG_4_WHEELER_XAPI_KEY,
  TATA_AIG_4_WHEELER_VIS_URL,
  TATA_AIG_4_WHEELER_VIS_KEY,
  TATA_AIG_4_WHEELER_PAYMENT_URL,
  TATA_AIG_4_WHEELER_PAYMENT_KEY,
  TATA_AIG_4_WHEELER_VERIFY_PAYMENT_URL,
  TATA_AIG_4_WHEELER_FORM60_URL,
  TATA_AIG_4_WHEELER_FORM60_KEY,
  TATA_AIG_4_WHEELER_AADHAAR_OTP_URL,
  TATA_AIG_4_WHEELER_AADHAAR_OTP_KEY,
  TATA_AIG_4_WHEELER_POLICY_DOWNLOAD_URL,
  TATA_AIG_4_WHEELER_DOWNLOAD_KEY
} = process.env;

const quoteApi = async (req, res) => {
  const authToken = req.headers.authorization;
  const data = req.body;
  try {
    const response = await axios.post(`${TATA_AIG_4_WHEELER_QUOTE_URL}`, data, {
      headers: {
        Authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const proposalApi = async (req, res) => {
  const authToken = req.headers.authorization;
  const datas = req.body; // Extract data from the request body
  try {
    const response = await axios.post(
      `${TATA_AIG_4_WHEELER_PROPOSAL_URL}`,
      datas,
      {
        headers: {
          Authorization: `${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const cKycApi = async (req, res) => {
  let url = req.originalUrl.match(/\/([^/]+)\/([^/]+)/);
  const { authorization } = req.headers;
  const datas = req.body; // Extract data from the request bodY
  try {
    const response = await axios.post(`${TATA_AIG_4_WHEELER_CKYC_URL}`, datas, {
      headers: {
        Authorization: `${authorization}`,
        "x-api-key": `${TATA_AIG_4_WHEELER_XAPI_KEY}`,
        "Content-Type": "application/json",
      },
      params: {
        product: url[2], // Pass the pin as a query parameter
      },
    });
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const aadhaarOtpApi = async (req, res) => {
  let url = req.originalUrl.match(/\/([^/]+)\/([^/]+)/);
  const { authorization } = req.headers;
  const datas = req.body; // Extract data from the request body
  try {
    const response = await axios.post(`${TATA_AIG_4_WHEELER_AADHAAR_OTP_URL}`, datas, {
      headers: {
        Authorization: `${authorization}`,
        "x-api-key": `${TATA_AIG_4_WHEELER_AADHAAR_OTP_KEY}`,
        "Content-Type": "application/json",
      },
      params: {
        product: url[2], // Pass the pin as a query parameter
      },
    });
    
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return  res.json(error.response?.data);
  }
};


const formSixtyApi = async (req, res) => {
  let url = req.originalUrl.match(/\/([^/]+)\/([^/]+)/);
  const { authorization } = req.headers;
  const datas = req.body; // Extract data from the request body
  try {
    const response = await axios.post(`${TATA_AIG_4_WHEELER_FORM60_URL}`, datas, {
      headers: {
        Authorization: `${authorization}`,
        "x-api-key": `${TATA_AIG_4_WHEELER_FORM60_KEY}`,
        "Content-Type": "application/json",
      },
      params: {
        product: url[2], // Pass the pin as a query parameter
      },
    });
    
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return  res.json(error.response?.data);
  }
};

const verifyInspectionApi = async (req, res) => {
  const { authorization } = req.headers;
  const datas = req.body; // Extract data from the request body
  
  try {
    const response = await axios.post(`${TATA_AIG_4_WHEELER_VIS_URL}`, datas, {
      headers: {
        Authorization: `${authorization}`,
        "x-api-key": `${TATA_AIG_4_WHEELER_VIS_KEY}`,
        "Content-Type": "application/json",
      },
    });
  
    if (response.data) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};


const makePayment = async (req, res) => {
  let url = req.originalUrl.match(/\/([^/]+)\/([^/]+)/);
  const { authorization } = req.headers;
  const datas = req.body; // Extract data from the request body
  try {
    const response = await axios.post(`${TATA_AIG_4_WHEELER_PAYMENT_URL}`, datas, {
      headers: {
        Authorization: `${authorization}`,
        "x-api-key": `${TATA_AIG_4_WHEELER_PAYMENT_KEY}`,
        "Content-Type": "application/json",
      },
      params: {
        product: url[2], // Pass the pin as a query parameter
      },
    });
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const verifyPayment = async (req, res) => {
  let url = req.originalUrl.match(/\/([^/]+)\/([^/]+)/);
  const { authorization } = req.headers;
  const datas = req.body; // Extract data from the request body
  try {
    const response = await axios.post(`${TATA_AIG_4_WHEELER_VERIFY_PAYMENT_URL}`, datas, {
      headers: {
        Authorization: `${authorization}`,
        "x-api-key": `${TATA_AIG_4_WHEELER_PAYMENT_KEY}`,
        "Content-Type": "application/json",
      },
      params: {
        product: url[2], // Pass the pin as a query parameter
      },
    });
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const motorPolicyDownload = async (req, res) => {
  const { authorization } = req.headers;
  const {encrypted_policy_id}  = req.params; // Extract the policy number from the request body


  if (!encrypted_policy_id) {
    return res.status(400).json({
      error: true,
      message: "Policy number is required",
    });
  }
  try {
    const response = await axios.get(`${TATA_AIG_4_WHEELER_POLICY_DOWNLOAD_URL}/${encrypted_policy_id}`, {
      headers: {
        Authorization: `${authorization}`,
        "x-api-key": `${TATA_AIG_4_WHEELER_DOWNLOAD_KEY}`,
      },
    });
    if (response?.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);   
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const vehicleMfg = async (req, res) => {
  const uatToken = req.headers.authorization;
  try {
    const response = await axios.get(`${TATA_AIG_4_WHEELER_MANUFACTURER}`, {
      headers: {
        Authorization: `${uatToken}`,
      },
    });
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const vehicleMfgModel = async (req, res) => {
  const uatToken = req.headers.authorization;
  const { code, name } = req.params;
  try {
    const response = await axios.get(
      `${TATA_AIG_4_WHEELER_MANUFACTURER_MODEL}/${code}/${name}`,
      {
        headers: {
          Authorization: `${uatToken}`,
        },
      }
    );
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const vehicleMfgModelVariant = async (req, res) => {
  const uatToken = req.headers.authorization;
  const { code, name } = req.params;
  try {
    const response = await axios.get(
      `${TATA_AIG_4_WHEELER_MANUFACTURER_MODEL_VARIANT}/${code}/${name}`,
      {
        headers: {
          Authorization: `${uatToken}`,
        },
      }
    );
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const vehicleMfgModelVariantData = async (req, res) => {
  const uatToken = req.headers.authorization;
  const { code, name, vcode, vname } = req.params;
  try {
    const response = await axios.get(
      `${TATA_AIG_4_WHEELER_MANUFACTURER_MODEL_VARIANT}/${code}/${name}/${vcode}/${vname}`,
      {
        headers: {
          Authorization: `${uatToken}`,
        },
      }
    );
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const vehicleMfgModelVariantPriceData = async (req, res) => {
  const uatToken = req.headers.authorization;
  const { id, name, vid, vname, txt_uw_zone } = req.params;
  try {
    const response = await axios.get(
      `${TATA_AIG_4_WHEELER_MANUFACTURER_MODEL_VARIANT_PRICEDATA}/${id}/${name}/${vid}/${vname}/${txt_uw_zone}`,
      {
        headers: {
          Authorization: `${uatToken}`,
        },
      }
    );
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const rto = async (req, res) => {
  const rtoToken = req.headers.authorization;
  try {
    const response = await axios.get(`${TATA_AIG_4_WHEELER_RTO}`, {
      headers: {
        Authorization: `${rtoToken}`,
      },
    });
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const rtoByLocation = async (req, res) => {
  const rtoToken = req.headers.authorization;
  const { code, location } = req.params;
  try {
    const response = await axios.get(
      `${TATA_AIG_4_WHEELER_RTO}/${code}/${location}`,
      {
        headers: {
          Authorization: `${rtoToken}`,
        },
      }
    );
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const rtoByCode = async (req, res) => {
  const rtoToken = req.headers.authorization;
  const { code1, code2 } = req.params;
  try {
    const response = await axios.get(
      `${TATA_AIG_4_WHEELER_RTO_BY_CODE}/${code1}/${code2}`,
      {
        headers: {
          Authorization: `${rtoToken}`,
        },
      }
    );
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const pincode = async (req, res) => {
  const rtoToken = req.headers.authorization;
  const { pin } = req.query;
  try {
    const response = await axios.get(`${TATA_AIG_4_WHEELER_PINCODE}`, {
      headers: {
        Authorization: `${rtoToken}`,
      },
      params: {
        pin, // Pass the pin as a query parameter
      },
    });
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const prevInsurer = async (req, res) => {
  const prevToken = req.headers.authorization;
  try {
    const response = await axios.get(`${TATA_AIG_4_WHEELER_PREV_INSURER}`, {
      headers: {
        Authorization: `${prevToken}`,
      },
    });
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const financier = async (req, res) => {
  const prevToken = req.headers.authorization;
  try {
    const response = await axios.get(`${TATA_AIG_4_WHEELER_FINANCIER}`, {
      headers: {
        Authorization: `${prevToken}`,
      },
    });
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const policyPlans = async (req, res) => {
  const planToken = req.headers.authorization;
  try {
    const response = await axios.get(`${TATA_AIG_4_WHEELER_POLICY_PLAN}`, {
      headers: {
        Authorization: `${planToken}`,
      },
    });
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

export {
  quoteApi,
  proposalApi,
  vehicleMfg,
  vehicleMfgModel,
  vehicleMfgModelVariant,
  vehicleMfgModelVariantData,
  vehicleMfgModelVariantPriceData,
  rto,
  rtoByLocation,
  rtoByCode,
  pincode,
  prevInsurer,
  financier,
  policyPlans,
  cKycApi,
  formSixtyApi,
  verifyInspectionApi,
  makePayment,
  verifyPayment,
  aadhaarOtpApi,
  motorPolicyDownload
};
