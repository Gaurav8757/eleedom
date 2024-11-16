import Career from "../../models/user_models/careers.js";

export const userApplyForm = async (req, res) => {
    try {
      const { name, email, mobile, branch, address, qualification, applyDate, level, position } = req.body;
       // Check if a file is provided in the request
    const pdfs =
    req.files &&
    req.files["pdf"] &&
    req.files["pdf"][0]
      ?  `${req.protocol}://${req.get('host')}/uploads/`+
        req.files["pdf"][0].filename
      : null;
      // Create a new branch
      const newFormFilled = new Career({
        name, email, mobile, branch, address, qualification, applyDate, level, position, pdfs
      });
      // Save the new branch to the database
      await newFormFilled.save();
      return res.status(201).json({
        status: "Application Submitted Sucessfully....!",
        message: {
          newFormFilled,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: "Error During Submit....!",
        message: err.message,
      });
    }
  };
  
  // ************************* view lists ************************* //
  export const viewUserApplyForm = async (req, res) => {
    const filledList = await Career.find({});
    if (!filledList) {
      return res.status(400).json({
        status: "Error during Career List's open",
        message: "Invalid Career Lists",
      });
    } else {
      return res.status(200).json(filledList);
    }
  };
  
  // *********** delete user details according to company ****************** //
  export const deleteUserApplyForm = async (req, res) => {
    try {
      const userId = req.params.id;
      // console.log(req.params);
      const deletedfilled = await Career.findByIdAndDelete(userId);
      if (!deletedfilled) {
        return res.status(404).json({ message: "Deleted User Applied Form not found" });
      }
      return res.json({ message: "User Applied Form Deleted Sucessfully...!", deletedfilled });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };