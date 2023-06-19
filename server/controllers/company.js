const expressAsyncHandler = require("express-async-handler");
const Company = require("../models/Company");

const createCompany = expressAsyncHandler(async (req, res) => {
  const { title } = req.body;
  try {
    const existingCompany = await Company.findOne({ title });
    if (existingCompany) {
      return res.status(400).json({ error: "Company already exists" });
    }
    const company = await Company.create(req.body);
    res.status(201).json({ company: company });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  createCompany,
};
