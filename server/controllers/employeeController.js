const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl,supabaseKey);

const addEmployee = async (req, res) => {
  const { empname, empid, empmail, empphone, empdept, empjoiningdate, emprole } = req.body;

  try {
    // Check if employee ID or email already exists
    const { data: existingEmployee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .or(`emp_id.eq.${empid},emp_mail.eq.${empmail}`);
    
    if (fetchError) throw fetchError;

    if (existingEmployee.length > 0) {
      return res.status(400).json({ message: "Employee ID or Email already exists" });
    }

    // Insert new employee details
    const { error: insertError } = await supabase
      .from('employees')
      .insert({
        emp_name: empname,
        emp_id: empid,
        emp_mail: empmail,
        emp_phone: empphone,
        emp_dept: empdept,
        emp_joiningdate: empjoiningdate,
        emp_role: emprole,
      });

    if (insertError) throw insertError;

    return res.status(201).json({ message: "Employee details added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error occurred, details not added" });
  }
};

module.exports = { addEmployee };
