import VITE_DATA from "../../config/config.jsx";
const Data = {
  business_types: [
    {
      id: 1,
      name: "New Business",
      value: "01",
      authLink: `${VITE_DATA}/tataaig/auth/details`,
    },
    {
      id: 3,
      name: "Rollover",
      value: "03",
      authLink: `${VITE_DATA}/tataaig/auth/details`,
    },
    {
      id: 4,
      name: "Used Vehicle",
      value: "04",
      authLink: `${VITE_DATA}/tataaig/auth/details`,
    },
  ],

  policyPlans: [
    { id: "01", name: "Standalone TP (1 year)", variant: "Standalone TP" },
    {
      id: "02",
      name: "Package (1 year OD + 1 year TP)",
      variant: "PackagePolicy",
    },
    { id: "03", name: "Standalone TP (3 years)", variant: "Standalone TP" },
    {
      id: "04",
      name: "Package (1 year OD + 3 years TP)",
      variant: "PackagePolicy",
    },
    { id: "05", name: "Standalone OD (1 year)", variant: "Standalone OD" },
  ],

  customerTypes: [
    { id: "individual", value: "Individual", label: "Individual" },
    { id: "organisation", value: "Organisation", label: "Organisation" },
  ],
  policyTypes: [
    { id: "package", value: "Package", label: "Package" },
    { id: "liability", value: "Liability", label: "Liability" },
  ],

  paOwner: [
    { id: "yes", name: "Yes", value: "true" },
    { id: "no", name: "No", value: "false" },
  ],

  ownerTenure: [1, 3],

  gender: ["Male", "Female", "Other"],
  occupation: [
    "ACCOUNTANT",
    "ACTOR",
    "ASTRONOMER",
    "AUTO MECHANIC",
    "BARTENDER",
    "BIOLOGIST",
    "CARPENTER",
    "CHEMIST",
    "CHEF",
    "CIVIL ENGINEER",
    "CONSTRUCTION WORKER",
    "DATA SCIENTIST",
    "DENTIST",
    "ELECTRICIAN",
    "EVENT PLANNER",
    "FINANCIAL ANALYST",
    "FITNESS TRAINER",
    "FLIGHT ATTENDANT",
    "GRAPHIC DESIGNER",
    "HR MANAGER",
    "IT SUPPORT SPECIALIST",
    "LAWYER",
    "LOGISTICS MANAGER",
    "MARKETING MANAGER",
    "MECHANICAL ENGINEER",
    "MUSICIAN",
    "NURSE",
    "PHARMACIST",
    "PHOTOGRAPHER",
    "PILOT",
    "PLUMBER",
    "POLICE OFFICER",
    "REAL ESTATE AGENT",
    "RESEARCH SCIENTIST",
    "SOCIAL WORKER",
    "SALES EXECUTIVE",
    "TEACHER",
    "TRANSLATOR",
    "TRAVEL AGENT",
    "VETERINARIAN",
    "WAITER/WAITRESS",
    "WEB DEVELOPER",
    "ENVIRONMENTAL SCIENTIST",
    "ECONOMIST",
    "FIREFIGHTER",
    "OTHER",
  ],

  financier_types: [
    "Hypothecation",
    "Mortgage",
    "Lease",
    "Pledge",
    "Assignment",
    "Lien",
    "Collateral",
  ],

  financier_name: [
    "State Bank of India (SBI)",
    "HDFC Bank",
    "ICICI Bank",
    "Punjab National Bank (PNB)",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "IndusInd Bank",
  ],

  mstatus: ["Single", "Married", "Domestic Partnership"],

  titles: [
    "Adv",
    "Brig",
    "Capt",
    "Col",
    "Cust",
    "Dr",
    "Gen",
    "Hon",
    "Justice",
    "Lady",
    "Lt",
    "Maj",
    "Major",
    "Mast",
    "Md",
    "Mis",
    "Miss",
    "M/s.",
    "Mstr",
    "Mr",
    "Mrs",
    "Ms",
    "Mst",
    "Phd",
    "Prof",
    "Rev",
    "Shri",
    "Sist",
    "Wing Cdr",
    "Wing Commander",
  ],

  ncbvalues: [
    { id: "0", ncb: 0 },
    { id: "1", ncb: 20 },
    { id: "2", ncb: 25 },
    { id: "3", ncb: 35 },
    { id: "4", ncb: 45 },
    { id: "5", ncb: 50 },
    { id: "6", ncb: 55 },
    { id: "7", ncb: 65 },
  ],
  nomineeRelationships: [
    "Aunt",
    "Brother",
    "Brother-In-law",
    "CHAUFFEUR",
    "Chauffeur",
    "Daughter",
    "Daughter-In-law",
    "Employee",
    "Employer",
    "Fiance",
    "FRIEND",
    "Friend",
    "Father",
    "Father-In-law",
    "Granddaughter",
    "Grandfather",
    "Grandmother",
    "Grandson",
    "Husband",
    "INSURED (SELF-DRIVING)",
    "Insured",
    "Insured Estate",
    "Mother",
    "Mother-In-law",
    "Nephew",
    "Niece",
    "OTHERS",
    "Owner",
    "Partner",
    "RELATIVE",
    "Relatives",
    "Self",
    "Sister",
    "Sister-In-law",
    "Son",
    "Son-In-law",
    "Spouse",
    "Uncle",
    "Wife"
  ],
  
  policyBundles: [
    {
      motor_plan_opted_no: "P1",
      motor_plan_opted: "SILVER",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "NCB protection cover",
      ],
    },
    {
      motor_plan_opted_no: "P2",
      motor_plan_opted: "GOLD",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "NCB protection cover",
        "Roadside Assistance",
        "Key Replacement",
        

      ],
    },
    {
      motor_plan_opted_no: "P3",
      motor_plan_opted: "PEARL",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "NCB protection cover",
        "Roadside Assistance",
        "Key Replacement",
      ],
    },
    {
      motor_plan_opted_no: "P4",
      motor_plan_opted: "PEARL+",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "Consumables Expenses", 
        "NCB protection cover",
        "Roadside Assistance",
        "Key Replacement",
        "Engine Secure",
      ],
    },
    {
      motor_plan_opted_no: "P5",
      motor_plan_opted: "SAPPHIRE",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "Consumables Expenses",
        "NCB protection cover",
        "Roadside Assistance",
        "Key Replacement",
        "Tyre Secure",
      ],
    },
    {
      motor_plan_opted_no: "P6",
      motor_plan_opted: "SAPPHIREPLUS",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "Consumables Expenses",
        "NCB protection cover",
        "Roadside Assistance",
        "Key Replacement",
        "Engine Secure",
        "Tyre Secure", 
      ],
    },
    {
      motor_plan_opted_no: "P7",
      motor_plan_opted: "SAPPHIRE++",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "Consumables Expenses",
        "NCB protection cover",
        "Roadside Assistance",
        "Return to Invoice",
        "Key Replacement",
        "Engine Secure",
        "Tyre Secure",
      ],
    },
    {
      motor_plan_opted_no: "P10",
      motor_plan_opted: "PLATINUM",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "NCB protection cover",
        "Roadside Assistance",
        "Return to Invoice",
        "Key Replacement",
        "Engine Secure",
      ],
    },
    {
      motor_plan_opted_no: "P11",
      motor_plan_opted: "CORAL",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "NCB protection cover",
        "Roadside Assistance",
        "Key Replacement",
      ],
    },
    {
      motor_plan_opted_no: "P12",
      motor_plan_opted: "PEARL++",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "Consumables Expenses",
        "NCB protection cover",
        "Roadside Assistance",
        "Return to Invoice",
        "Key Replacement",
        "Engine Secure",
      ],
    },
  ],

  pa_owner_declaration: [
    "None",
    "No valid driving license",
    "Other motor policy with CPA",
    "Have standalone CPA >= 15 L",
  ],
  tyre_secure_options: ["DEPRECIATION BASIS", "REPLACEMENT BASIS"],
  engine_secure_options: ["WITH DEDUCTIBLE", "WITHOUT DEDUCTIBLE"],
  voluntary_amount: [2500, 5000, 7500, 15000],
  pre_pol_ncb: [0, 20, 25, 35, 45, 50, 55, 65],
  ncb_no_of_claims: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  marital_status: ["Single", "Married", "Divorced", "Separated", "Widowed"],
  id_type: ["AADHAAR", "CKYC", "CIN", "DL", "PASSPORT", "VOTERID"],


  GeneralInsurance: [
    {
      name: "tata_aig",
      image: "/c1Tata.png",
      links: "/login",
      categories: {
        motor: {
          "Pvt-Car": {
            zero: {
              name: "News",
              authLink: `${VITE_DATA}/tataaig/auth/details`,
              quoteLink: "https://uatapigw.tataaig.com/motor/v1/quote",
              custType: ["Individual", "Organisation"],
            },
            new: {
              name: "New",
              authLink: `${VITE_DATA}/tataaig/auth/details`,
              quoteLink: "https://uatapigw.tataaig.com/motor/v1/quote",
              custType: ["Individual", "Organisation"],
            },
            zero1: {
              name: "News1",
              authLink: `${VITE_DATA}/tataaig/auth/details`,
              quoteLink: "https://uatapigw.tataaig.com/motor/v1/quote",
              custType: ["Individual", "Organisation"],
            },
            rollover: {
              name: "Rollover",
              authLink: `${VITE_DATA}/tataaig/auth/details`,
              quoteLink: "https://uatapigw.tataaig.com/motor/v1/quote",
              custType: ["Individual", "Organisation"],
            },
            satp: {
              name: "SATP",
              authLink: `${VITE_DATA}/tataaig/auth/details`,
              quoteLink: "https://uatapigw.tataaig.com/motor/v1/quote",
              custType: ["Individual", "Organisation"],
            },
          },



          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/tata_aig/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/tata_aig/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/tata_aig/2_wheeler/comprehensive",
            },
          },



          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/tata_aig/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/tata_aig/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/tata_aig/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },

    {
      name: "magma_hdi",
      image: "/c2Magma.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/magma_hdi/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/magma_hdi/pvt_car/rollover",
            },
            satp: { name: "SATP", apiLink: "/api/magma_hdi/pvt_car/satp" },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/magma_hdi/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/magma_hdi/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/magma_hdi/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/magma_hdi/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/magma_hdi/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/magma_hdi/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },

    {
      name: "bajaj_allianz",
      image: "/c3Allianz.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/bajaj_allianz/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/bajaj_allianz/pvt_car/rollover",
            },
            satp: { name: "SATP", apiLink: "/api/bajaj_allianz/pvt_car/satp" },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/bajaj_allianz/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/bajaj_allianz/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/bajaj_allianz/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/bajaj_allianz/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/bajaj_allianz/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/bajaj_allianz/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },

    {
      name: "hdfc_ergo",
      image: "/c4Hdfc.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/hdfc_ergo/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/hdfc_ergo/pvt_car/rollover",
            },
            satp: { name: "SATP", apiLink: "/api/hdfc_ergo/pvt_car/satp" },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/hdfc_ergo/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/hdfc_ergo/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/hdfc_ergo/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/hdfc_ergo/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/hdfc_ergo/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/hdfc_ergo/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },

    {
      name: "icici_lombard",
      image: "/c4Icici.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/icici_lombard/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/icici_lombard/pvt_car/rollover",
            },
            satp: { name: "SATP", apiLink: "/api/icici_lombard/pvt_car/satp" },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/icici_lombard/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/icici_lombard/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/icici_lombard/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/icici_lombard/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/icici_lombard/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/icici_lombard/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },

    {
      name: "iffco_tokio",
      image: "/c6Iffico.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/iffco_tokio/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/iffco_tokio/pvt_car/rollover",
            },
            satp: { name: "SATP", apiLink: "/api/iffco_tokio/pvt_car/satp" },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/iffco_tokio/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/iffco_tokio/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/iffco_tokio/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/iffco_tokio/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/iffco_tokio/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/iffco_tokio/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },
    {
      name: "future_generali",
      image: "/c7future.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/future_generali/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/future_generali/pvt_car/rollover",
            },
            satp: {
              name: "SATP",
              apiLink: "/api/future_generali/pvt_car/satp",
            },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/future_generali/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/future_generali/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/future_generali/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/future_generali/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/future_generali/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/future_generali/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },
    {
      name: "liberty",
      image: "/c8Liberty.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/liberty/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/liberty/pvt_car/rollover",
            },
            satp: { name: "SATP", apiLink: "/api/liberty/pvt_car/satp" },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/liberty/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/liberty/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/liberty/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/liberty/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/liberty/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/liberty/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },
  ],

  LifeInsurance: [
    // Add life insurance data here
    {
      name: "PNB MetLife",
      image: "/l1pnb.png",
      links:
        "https://www.pnbmetlife.com/wps/PA_CustomerLogin/jsp/UserRegistration.jsp",
    },
    {
      name: "LIC",
      image: "/l2lic.png",
      links: "https://ebiz.licindia.in/D2CPM/#Login",
    },
    {
      name: "TATA AIA",
      image: "/l3aia.png",
      links: "https://grip.tataaia.com/TVG/",
    },
  ],

  HealthInsurance: [
    // Add health insurance data here
    {
      name: "Health Guard",
      image: "https://example.com/images/health_guard.jpg",
      links: "",
    },
    {
      name: "Wellness Plan",
      image: "https://example.com/images/wellness_plan.jpg",
      links: "",
    },
  ],
};

export default Data;
