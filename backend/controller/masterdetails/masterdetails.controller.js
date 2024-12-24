// insurancePolicyController.js
import cron from "node-cron";
import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";
import CompanyGrid from "../../models/commSlab/companypayout.js";
import { Counter } from "../../models/masterDetails/masterdetailSchema.js";

export const createAllInsurance = async (req, res) => {
  try {
    // Find the counter document for the policy reference numbers or create one if it doesn't exist
    let counter = await Counter.findOneAndUpdate(
      { policyrefno: "autoval" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    let seqId;
    if (!counter) {
      // If counter doesn't exist, create a new one with sequence value 1
      const newCounter = new Counter({ policyrefno: "autoval", seq: 1 });
      await newCounter.save();
      seqId = 1;
    } else {
      // Use the sequence value from the counter document
      seqId = counter.seq;
    }
    // Generate the five-digit policy number with leading zeros
    const policyNumber = seqId.toString().padStart(8, "0");

    const {
      entryDate,
      advId,
      sitcapacity,
      company,
      states,
      district,
      category,
      segment,
      sourcing,
      policyNo,
      insuredName,
      contactNo,
      vehRegNo,
      policyStartDate,
      policyEndDate,
      odExpiry,
      tpExpiry,
      idv,
      bodyType,
      makeModel,
      mfgYear,
      registrationDate,
      vehicleAge,
      fuel,
      gvw,
      cc,
      rsa,
      engNo,
      chsNo,
      policyType,
      productCode,
      odPremium,
      liabilityPremium,
      netPremium,
      finalEntryFields,
      odDiscount,
      ncb,
      advisorName,
      subAdvisor,
      policyMadeBy,
      branch,
      payoutOn,
      taxes,
      policyPaymentMode,
      paymentDoneBy,
      chqNoRefNo,
      bankName,
      chqPaymentDate,
      chqStatus,
      advisorPayableAmount,
      advisorPayoutAmount,
      branchPayout,
      branchPayableAmount,
      companyPayout,
      profitLoss,
      hypo,
      staffName,
      staffType,
      employee_id,
      currentTime,
      empTime,
      overallTime,
    } = req.body;

    const newInsurance = new AllInsurance({
      policyrefno: `EIPL/${new Date().getFullYear()}/${policyNumber}`,
      entryDate,
      company,
      sitcapacity,
      category,
      advId,
      states,
      district,
      segment,
      sourcing,
      policyNo,
      insuredName,
      contactNo,
      vehRegNo,
      policyStartDate,
      policyEndDate,
      odExpiry,
      tpExpiry,
      idv,
      bodyType,
      makeModel,
      mfgYear,
      registrationDate,
      vehicleAge,
      fuel,
      gvw,
      cc,
      rsa,
      engNo,
      chsNo,
      policyType,
      productCode,
      odPremium,
      liabilityPremium,
      netPremium,
      finalEntryFields,
      odDiscount,
      ncb,
      advisorName,
      subAdvisor,
      policyMadeBy,
      branch,
      payoutOn,
      taxes,
      policyPaymentMode,
      paymentDoneBy,
      chqNoRefNo,
      bankName,
      chqPaymentDate,
      chqStatus,
      advisorPayoutAmount,
      advisorPayableAmount,
      branchPayout,
      branchPayableAmount,
      companyPayout,
      profitLoss,
      hypo,
      staffName,
      staffType,
      currentTime,
      empTime,
      overallTime,
      employee_id,
    });

    // Save the company to the database
    await newInsurance.save();
    return res.status(201).json({
      status: "Policy Created Successfully...!",
      message: {
        newInsurance,
      },
    });
  } catch (error) {
    console.error("Error creating insurance policy:", error);
    res.status(500).json({ error: "Internal Server Error", error });
  }
};

// Controller function to handle updating specific fields of a company
export const updateMasterDetails = async (req, res) => {
  try {
    const detailsId = req.params.id;
    const updateDetails = req.body;
    // Check if the insurace lists exists before attempting to update
    const existingDetails = await AllInsurance.findById(detailsId);

    if (!existingDetails) {
      return res.status(404).json({
        status: "Insurance Details not found",
        message: "The specified Insurance ID does not exist in the database",
      });
    }

    // Perform the update
    const updatedDetails = await AllInsurance.findByIdAndUpdate(
      detailsId,
      updateDetails,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      status: "Policy Updated Successfully..! ",
      message: {
        updatedDetails,
      },
    });
  } catch (err) {
    console.error(err);

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        status: "Validation Error",
        message: err.message,
      });
    }

    return res.status(500).json({
      status: "Internal Server Error",
      message: err.message,
    });
  }
};

// Helper Functions
const calculateBranchPayableAmount = (finalEntryFields, branchPayout) =>
  finalEntryFields - branchPayout;

const calculateBranchPayoutAmount = (finalEntryFields, branchpayoutper) =>
  finalEntryFields * (branchpayoutper / 100);

const calculateCompanyPayoutAmount = (finalEntryFields, companypayoutper) =>
  finalEntryFields * (companypayoutper / 100);


export const recalculateAndUpdate = async (req, res) => {
  try {
    const allDetailsData = await AllInsurance.find({
      $or: [
        { branchpayoutper: { $in: [null, undefined, ""] } },
        { companypayoutper: { $in: [null, undefined, ""] } },
        { companyPayout: { $in: [0, null, undefined, ""] } },
        { branchPayableAmount: { $in: [null, undefined, ""] } },
        { branchPayout: { $in: [0, null, undefined, ""] } },
      ],
    });

    if (!Array.isArray(allDetailsData) || allDetailsData.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid data format. Expected a non-empty array.",
      });
    }

    // Fetch payout slabs from the database
    const payoutSlab = await CompanyGrid.find({});
    if (!payoutSlab || payoutSlab.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No payout slabs found in the database.",
      });
    }

    const updates = allDetailsData.map(async (data) => {
      if (!data.payoutOn) return null;
      const vehicleAge1 = parseInt(data.vehicleAge, 10);
      const vehicleAgeNormalized =
        data.vehicleAge === "0 years" || data.vehicleAge === "0" || vehicleAge1 === 0 ||
        data.vehicleAge === 0 

          ? 0
          : 1;

      const matchingCSLab = payoutSlab.find((slab) => {
        const isMatching =
          (slab.vage === "NEW" && vehicleAgeNormalized === 0) ||
          (slab.vage === "OLD" && vehicleAgeNormalized !== 0);

        return (
          slab.cnames === data.company &&
          slab.catnames === data.category &&
          slab.policytypes === data.policyType &&
          slab.states === data.states &&
          (slab.vfuels === data.fuel ||
            slab.vfuels === "ALL" ||
            !slab.vfuels ||
            (slab.vfuels === "OTHER THAN DIESEL" && data.fuel !== "DIESEL")) &&
          (!slab.vncb ||
            slab.vncb === data.ncb ||
            ["BOTH"].includes(slab.vncb)) &&
          slab.pcodes === data.productCode &&
          (slab.districts === data.district ||
            slab.districts === "All" ||
            slab.districts === "ALL") &&
          slab.payoutons === data.payoutOn &&
          (slab.sitcapacity === data.sitcapacity ||
            slab.sitcapacity === "All" ||
            slab.sitcapacity === "ALL" ||
            !slab.sitcapacity) &&
          slab.segments === data.segment &&
          (slab.voddiscount === data.odDiscount || !slab.voddiscount) &&
          (isMatching ||
            (slab.vage === "1-7 YEARS" &&
              vehicleAge1 >= 1 &&
              vehicleAge1 <= 7) ||
            (slab.vage === "MORE THAN 7 YEARS" && vehicleAge1 > 7)) &&
          (slab.vcc === data.cc ||
            ["ALL", "", null, undefined].includes(slab.vcc))
        );
      });

      if (!matchingCSLab) return null;

      const branchpercent = matchingCSLab.branchpayoutper || 0;
      const companypercent = matchingCSLab.companypayoutper || 0;
      const netPremium = parseFloat(data.netPremium);
      const finalEntryFields = parseFloat(data.finalEntryFields);
      const odPremium = parseFloat(data.odPremium);
      let branchPayout, companyPayout, branchPayable, profitLoss;

      if (
        data.policyType === "COMP" &&
        data.productCode === "PVT-CAR" &&
        data.payoutOn === "OD"
      ) {
        branchPayout = calculateBranchPayoutAmount(odPremium, branchpercent);
        branchPayable = calculateBranchPayableAmount(
          finalEntryFields,
          branchPayout
        );
        companyPayout = calculateCompanyPayoutAmount(odPremium, companypercent);
        profitLoss = companyPayout - branchPayout;
      } else {
        branchPayout = calculateBranchPayoutAmount(netPremium, branchpercent);
        branchPayable = calculateBranchPayableAmount(
          finalEntryFields,
          branchPayout
        );
        companyPayout = calculateCompanyPayoutAmount(
          netPremium,
          companypercent
        );
        profitLoss = companyPayout - branchPayout;
      }

      // Prepare the update data
      if (
        !data.companyPayout ||
        !data.branchPayableAmount ||
        !data.branchPayout ||
        !data.profitLoss ||
        !branchpercent ||
        !companypercent
      ) {
        const updatePayload = {
          policyrefno: data.policyrefno,
          entryDate: data.entryDate,
          branchPayableAmount: Number(branchPayable.toFixed(2)),
          branchPayout: Number(branchPayout.toFixed(2)),
          companyPayout: Number(companyPayout.toFixed(2)),
          profitLoss: Number(profitLoss.toFixed(2)),
          branchpayoutper: Number(branchpercent),
          companypayoutper: Number(companypercent),
        };
        console.log(updatePayload);

        return AllInsurance.findByIdAndUpdate(data._id, updatePayload, {
          new: true,
          runValidators: true,
        });
      }
    });
    const results = await Promise.all(updates);
    const updatedRecords = results.filter((record) => record !== null);
    return res.status(200).json({
      status: "success",
      message: `${updatedRecords.length} calculation updated successfully..!`,
      data: updatedRecords,
    });
  } catch (error) {
    console.error("Error in recalculateAndUpdate:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// Bulk update endpoint for processing all details
export const bulkUpdateDetails = async () => {
  try {
    const allDetailsData = await AllInsurance.find({
      payoutOn: { $in: [null, ""] },
    });
    
      // const allDetailsData = await AllInsurance.find();
      if (!Array.isArray(allDetailsData)) {
        console.error("Invalid data format. Expected an array of details.");
        return;
      }
  
      const updates = allDetailsData.map(async (data) => {
        let paydata;
  
        if (!data.paydata) { 
          if (data.policyType === "COMP" && data.productCode === "PVT-CAR") {
            paydata = { payoutOn: "OD" };
          } else {
            paydata = { payoutOn: "NET" };
          }
        } else if (
          data.policyType === "COMP" &&
          data.productCode === "PVT-CAR" &&
          data.paydata !== "OD"
        ) {
          paydata = { payoutOn: "OD" };
        } else if (
          !(data.policyType === "COMP" && data.productCode === "PVT-CAR") &&  data.paydata !== "NET") {
          paydata = { payoutOn: "NET" }
        }
  
        if (!paydata) return null;
  
        return AllInsurance.findByIdAndUpdate(data._id, paydata, {
          new: true,
          runValidators: true,
        });
      });
    const results = await Promise.all(updates);
    const updatedRecords = results.filter((record) => record !== null);
    console.log(`${updatedRecords.length} payoutOn updated successfully...!`);
  } catch (error) {
    console.error("Error in payoutOn update:", error);
  }
};

const updateNullFieldsToZero = async () => {
  try {
    // Find all documents with null values in specific fields
    const documents = await AllInsurance.find({
      $or: [
        { cvpercentage: { $eq: null } },
        { branchpayoutper: { $eq: null } },
        { companypayoutper: { $eq: null } },
        {advisorPayableAmount: { $eq: null } },
        { branchPayableAmount: { $eq: null } },
        { branchPayout: { $eq: null } },
        { companyPayout: { $eq: null } },
        { profitLoss: { $eq: null } },
      ],
    });

    console.log(`${documents.length} documents found with null values.`);

    // Prepare updates for documents
    const updates = documents.map((doc) => {
      const updatedFields = {};

      // Replace null values with 0 for each relevant field
      if (doc.cvpercentage === null) updatedFields.cvpercentage = 0;
      if (doc.branchpayoutper === null) updatedFields.branchpayoutper = 0;
      if (doc.companypayoutper === null) updatedFields.companypayoutper = 0;
      if (doc.advisorPayableAmount === null) updatedFields.advisorPayableAmount = 0;
      if (doc.branchPayableAmount === null) updatedFields.branchPayableAmount = 0;
      if (doc.branchPayout === null) updatedFields.branchPayout = 0;
      if (doc.companyPayout === null) updatedFields.companyPayout = 0;
      if (doc.profitLoss === null) updatedFields.profitLoss = 0;

      // Update document if changes are needed
      if (Object.keys(updatedFields).length > 0) {
        return AllInsurance.findByIdAndUpdate(doc._id, { $set: updatedFields }, { new: true });
      }

      return null; // No update needed
    });
    // Wait for all updates to complete
    const results = await Promise.all(updates);
    // Filter and count updated documents
    const updatedRecords = results.filter(Boolean);
    console.log(`${updatedRecords.length} null updated successfully...!`);
  } catch (error) {
    console.error("Error updating null to 0:", error);
  }
};


// Schedule the function to run every 1 minutes
cron.schedule("*/1 * * * *", async () => {
  await bulkUpdateDetails();
  await updateNullFieldsToZero();
  await recalculateAndUpdate();
  
});

// // view lists
export const viewPolicyBasedonId = async (req, res) => {
  const { employee_id } = req.params;
  const policyBasedonId = await AllInsurance.find({ employee_id });
  if (!policyBasedonId) {
    return res.status(400).json({
      status: "Error during view lists Update",
      message: "Invalid view list selected",
    });
  } else {
    return res.status(200).json(policyBasedonId);
  }
};

export const viewAdvisorListing = async (req, res) => {
  const { advisorName } = req.query;
  try {
    const allList = await AllInsurance.aggregate([
      {
        $match: {
          advisorName: advisorName, // Filter documents where advisorname matches adv_id
        },
      },
      {
        $lookup: {
          from: "advisors", // Name of the advisors collection
          localField: "advisorname", // Field in the insurance collection
          foreignField: "advisorName", // Field in the advisors collection
          as: "allpolicyemployee", // Name of the field to store the advisor details
        },
      },
    ]);
    if (allList.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "No lists found for the given advisor ID",
      });
    } else {
      return res.status(200).json(allList);
    }
  } catch (error) {
    console.error("Error viewing lists:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};

export const updateByAdvisor = async (req, res) => {
  const updates = req.body;

  try {
    // Check if the updates array is empty
    if (updates.length === 0) {
      return res.status(400).json({ message: "No updates found" });
    }

    // Prepare an array to store the bulk write operations
    const bulkOperations = [];

    // Iterate over each update and construct bulk write operations
    updates.forEach((update) => {
      const { policyrefno, company, insuredName, policyMadeBy, cvpercentage } =
        update;

      // Construct the filter criteria
      const filter = { policyrefno, company, insuredName, policyMadeBy };

      // Construct the update operation
      const updateOperation = {
        $set: {
          cvpercentage,
          // advisorPayoutAmount,
          // advisorPayableAmount,
        },
      };

      // Add the update operation to the bulk operations array
      bulkOperations.push({
        updateOne: {
          filter,
          update: updateOperation,
        },
      });
    });

    // Perform bulk updates using bulkWrite method
    await AllInsurance.bulkWrite(bulkOperations);

    return res
      .status(200)
      .json({ message: "Advisor data updated successfully", bulkOperations });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating advisor data: " + error.message });
  }
};

export const viewMonthlyData = async (req, res) => {
  let { page = 1, limit = 1000 } = req.query; // Default page: 1, Default limit: 1000
  try {
    page = parseInt(page); // Convert page to integer
    limit = parseInt(limit); // Convert limit to integer

    // Check if page and limit are valid integers
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid page or limit",
      });
    }

    // Calculate the month offset based on the page number
    const monthOffset = page - 1;

    // Get the current date, and adjust the month based on the offset
    const currentDate = new Date();
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      1
    );

    const targetYear = targetDate.getFullYear();
    const targetMonth = (targetDate.getMonth() + 1).toString().padStart(2, "0");

    // Calculate the start and end dates for the target month
    const startDate = new Date(`${targetYear}-${targetMonth}-01`);
    const endDate = new Date(targetYear, targetDate.getMonth() + 1, 0); // Last day of the target month

    // Convert dates to ISO format strings for MongoDB query
    const startISODate = startDate.toISOString().split("T")[0];
    const endISODate = endDate.toISOString().split("T")[0];

    // Optimize the query by selecting only necessary fields
    const matchStage = {
      $match: {
        entryDate: { $gte: startISODate, $lte: endISODate },
      },
    };

    const lookupStage = {
      $lookup: {
        from: "addemployees",
        let: { empId: "$empname" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$employee_id", "$$empId"] },
            },
          },
          {
            $project: {
              _id: 0, // Exclude _id field
              employee_id: 1,
              // Add other fields you need
            },
          },
        ],
        as: "allpolicyemployee",
      },
    };

    const sortStage = { $sort: { entryDate: -1 } }; // Sort by entryDate field in descending order
    const skipStage = { $skip: (page - 1) * limit };
    const limitStage = { $limit: limit };

    const totalCount = await AllInsurance.countDocuments(matchStage.$match); // Count total documents for the current date range
    const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

    const allList = await AllInsurance.aggregate([
      matchStage,
      lookupStage,
      sortStage,
      skipStage,
      limitStage,
    ]);

    if (allList.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "No lists found for the current period",
      });
    } else {
      return res.status(200).json({ allList, totalPages });
    }
  } catch (error) {
    console.error("Error viewing lists:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};

export const viewAllPoliciesLists = async (req, res) => {
  try {
    const dayss = await AllInsurance.find({});

    if (!dayss) {
      return res.status(400).json({
        status: "Error during policies lists Update",
        message: "Invalid policies selected..!",
      });
    } else {
      return res.status(200).json(dayss);
    }
  } catch (error) {
    return res.status(400).json({
      status: "Error during View policies Lists....!",
      message: error.message,
    });
  }
};

// export const viewAllList = async (req, res) => {
//   let { page, limit=1000 } = req.query; // Default page: 1, Default limit: 20
//   try {
//     page = parseInt(page); // Convert page to integer
//     // Check if page is not a valid integer or less than 1
//     if (isNaN(page) || page < 1) {
//       return res.status(400).json({
//         status: "Error",
//         message: "Invalid page number"
//       });
//     }
//     const skip = (page - 1) * parseInt(limit); // Calculate the number of documents to skip
//     const totalCount = await AllInsurance.countDocuments(); // Count total documents
//     const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

//     const allList = await AllInsurance.aggregate([
//       {
//         $lookup: {
//           from: "addemployees",
//           let: { empId: "$empname" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $eq: ["$employee_id", "$$empId"] }
//               }
//             },
//             {
//               $project: {
//                 _id: 0, // Exclude _id field
//                 employee_id: 1,
//                 // Add other fields you need
//               }
//             }
//           ],
//           as: "allpolicyemployee"
//         }
//       },
//       { $sort: { entryDate: -1 } }, // Sort by createdAt field in descending order
//       { $skip: skip },
//       { $limit: parseInt(limit) }
//     ]);

//     if (allList.length === 0) {
//       return res.status(404).json({
//         status: "Error",
//         message: "No lists found for the given employee ID"
//       });
//     } else {
//       return res.status(200).json({ allList, totalPages });
//     }
//   } catch (error) {
//     console.error("Error viewing lists:", error);
//     return res.status(500).json({
//       status: "Error",
//       message: "Internal server error"
//     });
//   }
// };

export const viewAllList = async (req, res) => {
  let { page = 1, limit = 1000 } = req.query; // Default page: 1, Default limit: 1000

  try {
    page = parseInt(page);
    limit = parseInt(limit);

    // Validate page and limit
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid page or limit values",
      });
    }

    const skip = (page - 1) * limit;

    // Run countDocuments and data query concurrently
    const [totalCount, allList] = await Promise.all([
      AllInsurance.countDocuments(),
      AllInsurance.aggregate([
        { $sort: { entryDate: -1 } }, // Sort first to improve performance
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "addemployees",
            let: { empId: "$empname" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$employee_id", "$$empId"] },
                },
              },
              {
                $project: {
                  _id: 0, // Exclude _id field
                  employee_id: 1,
                },
              },
            ],
            as: "allpolicyemployee",
          },
        },
        // {
        //   $project: {
        //     empname: 1,
        //     entryDate: 1,
        //     allpolicyemployee: 1,
        //   },
        // },
      ]),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    if (allList.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "No lists found",
      });
    }

    return res.status(200).json({ allList, totalPages, totalCount });
  } catch (error) {
    console.error("Error viewing lists:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};

export const viewPoliciesList = async (req, res) => {
  try {
    // Extract query parameters from the request
    const { fromDate, toDate, advisorName, policyNo, insuredName } = req.query;
    // Construct the filter object based on the provided parameters
    const filter = {};
    if (fromDate) filter.entryDate = { $gte: new Date(fromDate) };
    if (toDate)
      filter.entryDate = { ...filter.entryDate, $lte: new Date(toDate) };
    if (advisorName)
      filter.advisorName = { $regex: new RegExp(advisorName, "i") };
    if (policyNo) filter.policyNo = { $regex: new RegExp(policyNo, "i") };
    if (insuredName)
      filter.insuredName = { $regex: new RegExp(insuredName, "i") };

    // Find documents based on the constructed filter
    const allList = await AllInsurance.find(filter);

    if (allList.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "No policies found",
      });
    } else {
      return res.status(200).json({ allList });
    }
  } catch (error) {
    console.error("Error viewing lists:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};

// show data on the basis of branch name query
export const viewHajipurList = async (req, res) => {
  const { branch } = req.query;
  // Constructing case-insensitive regex for matching branch name
  const branchRegex = new RegExp(`^${branch}$`, "i");
  const hajipurList = await AllInsurance.find({
    branch: branchRegex,
  }).sort({ entryDate: -1 });

  if (!hajipurList || hajipurList.length === 0) {
    return res.status(400).json({
      status: "Error during view lists Update",
      message: `Invalid view list selected or no lists available for ${branch} branch`,
    });
  } else {
    return res.status(200).json(hajipurList);
  }
};

//  delete branch controller
export const deleteAllList = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedAllInsurance = await AllInsurance.findByIdAndDelete(userId);
    if (!deletedAllInsurance) {
      return res.status(404).json({ message: "AllInsurance not found" });
    }
    return res.json({
      message: `${deletedAllInsurance.policyrefno} Deleted successfully.....!`,
      deletedAllInsurance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
