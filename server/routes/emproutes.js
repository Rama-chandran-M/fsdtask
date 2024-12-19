const express = require("express");
const router = express.Router();
const{addEmployee} = require("../controllers/employeeController.js");
router.post("/add",addEmployee);
module.exports = router;