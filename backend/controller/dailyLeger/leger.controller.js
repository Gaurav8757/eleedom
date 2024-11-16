import Allinsurance from "../../models/masterDetails/masterdetailSchema.js";
import DailyLeger from "../../models/dailyLeger/dailyleger.js"
export const addDailyLeger = async (req, res) => {
  const entries = req.body;
  try {
    // Check if the entries array is empty
    if (entries.length === 0) {
      return res.status(400).json({ message: "No data found to save" });
    }
    const savedPolicyNumbers = []; // Array to store saved policy numbers
    // Loop through each entry and save it
    await Promise.all(
      entries.map(async (entry) => {
        const newEntry = new DailyLeger(entry);
        await newEntry.save();
        savedPolicyNumbers.push(newEntry.advisorName); // Store the policy number
      })
    );
    // Return success message along with saved policy numbers
    return res.status(200).json({
      message: "Daily Leger Saved Successfully....!",
      savedPolicyNumbers,
    });
  } catch (error) {
    throw new Error("Error adding entry to Daily Ledger: " + error.message);
  }
};

// // VIEW  ALL DATA OF VEHICLE SLAB
// export const viewDailyLeger = async (req, res) => {
//   try {
//     // Fetch all VehicleSlab documents from the database
//     const leger = await DailyLeger.find();
//     // Respond with the retrieved documents
//     return res.status(200).json(leger);
//   } catch (error) {
//     // Handle errors
//     console.error("Error fetching Daily Leger Leger:", error);
//     return res.status(500).json({ error: "Failed to fetch Daily Leger" });
//   }
// };



// Update entry in Daily Ledger
// export const updateDailyLeger = async (req, res) => {
//   const inputData = req.body.inputData;
//   const { advId, advisorName } = req.query; // Destructure advId and advisorName from inputData
//   try {
//     const updatedEntry = await Allinsurance.updateOne({ advId, advisorName }, { $set: { value: inputData } });
//     return updatedEntry;
//   } catch (error) {
//     throw new Error("Error updating entry in Daily Ledger: " + error.message);
//   }
// };

export const updateDailyLeger = async (req, res) => {
  const updates = req.body;

  try {
    // Check if the updates array is empty
    if (updates.length === 0) {
      return res.status(400).json({ message: "No updates found" });
    }

    // Prepare an array to store the bulk write operations
    const bulkOperations = [];

    // Iterate over each update and construct bulk write operations
    updates.forEach(update => {
      const { advId, advisorName, debitCompanyAmount, debitMonthlyAmount, entryDate, policyNo, insuredName, debitAmount, paymentDate,paymentMonthlyDate,paymentCompanyDate, paymentType,paymentMonthlyType, paymentCompanyType, paymentRefNo,paymentMonthlyRefNo ,paymentCompanyRefNo, creditAmount,creditMonthlyAmount,creditCompanyAmount, balance, balanceMonthly, balanceCompany } = update;
      
      // Construct the filter criteria
      const filter = { advId, advisorName, entryDate, policyNo, insuredName };
      
      // Construct the update operation
      const updateOperation = {
        $set: {
          debitAmount,
          debitMonthlyAmount,
          debitCompanyAmount,
          paymentDate,
          paymentMonthlyDate,
          paymentCompanyDate,
          paymentType,
          paymentMonthlyType,
          paymentCompanyType,
          paymentRefNo,
          paymentMonthlyRefNo,
          paymentCompanyRefNo,
          creditAmount,
          creditMonthlyAmount,
          creditCompanyAmount,
          balance,
          balanceMonthly,
          balanceCompany
        }
      };
      
      // Add the update operation to the bulk operations array
      bulkOperations.push({
        updateOne: {
          filter,
          update: updateOperation
        }
      });
    });


    // Perform bulk updates using bulkWrite method
    await Allinsurance.bulkWrite(bulkOperations);
    return res.status(200).json({ message: "Daily Leger Updated Successfully...!" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating Leger: " + error.message });
  }
};

// export const updateMonthlyLeger = async (req, res) => {
//   const updates = req.body;

//   try {
//     // Check if the updates array is empty
//     if (updates.length === 0) {
//       return res.status(400).json({ message: "No updates found" });
//     }

//     // Prepare an array to store the bulk write operations
//     const bulkOperations = [];

//     // Iterate over each update and construct bulk write operations
//     updates.forEach(update => {
//       const { entryDate, paymentCompanyDate, paymentCompanyType, paymentCompanyRefNo, creditCompanyAmount } = update;

//       // Check if all specified fields are non-empty for the current update
//       if (paymentCompanyDate || paymentCompanyType || paymentCompanyRefNo || creditCompanyAmount) {
//         // Construct the filter criteria
//         const filter = { entryDate };

//         // Construct the update operation
//         const updateOperation = {
//           $set: {
//             paymentCompanyDate: paymentCompanyDate || '',
//             paymentCompanyType: paymentCompanyType || '',
//             paymentCompanyRefNo: paymentCompanyRefNo || '',
//             creditCompanyAmount: parseFloat(creditCompanyAmount) || 0
//           }
//         };

//         // Add the update operation to the bulk operations array
//         bulkOperations.push({
//           updateOne: {
//             filter,
//             update: updateOperation
//           }
//         });
//       }
//     });

//     // Perform bulk updates using bulkWrite method
//     await Allinsurance.bulkWrite(bulkOperations);

//     return res.status(200).json({ message: "Company Leger Updated Successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: "Error updating Company Leger: " + error.message });
//   }
// };

export const updateMonthlyLeger = async (req, res) => {
  const updates = req.body;

  try {
    // Check if the updates array is empty
    if (updates.length === 0) {
      return res.status(400).json({ message: "No updates found" });
    }

    // Iterate over each update and perform individual updates
    for (const update of updates) {
      const { entryDate, paymentCompanyDate, paymentCompanyType, paymentCompanyRefNo, creditCompanyAmount } = update;

      // Check if all specified fields are non-empty for the current update
      if (paymentCompanyDate || paymentCompanyType || paymentCompanyRefNo || creditCompanyAmount) {
        // Construct the filter criteria
        const filter = { entryDate };

        // Construct the update operation
        const updateOperation = {
          $set: {
            paymentCompanyDate: paymentCompanyDate || '',
            paymentCompanyType: paymentCompanyType || '',
            paymentCompanyRefNo: paymentCompanyRefNo || '',
            creditCompanyAmount: parseFloat(creditCompanyAmount) || 0
          }
        };

        // Perform individual update using findOneAndUpdate method
        await Allinsurance.findOneAndUpdate(filter, updateOperation);
      }
    }

    return res.status(200).json({ message: "Company Leger Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating Company Leger: " + error.message });
  }
};
