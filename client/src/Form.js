import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import './Form.css';

const EmployeeForm = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        mode: "onBlur"
    });
    const [message, setMessage] = useState("");
    const [submittedData, setSubmittedData] = useState(null);

    const onSubmit = async (data) => {
        try {
            console.log("Form data submitted:", data); 
            const temp = process.env.REACT_APP_SERVER_URL;
            const response = await axios.post(`${temp}/api/employees/add`, data);
            
            console.log("Response received:", response);
            
            setMessage(response.data.message);
            setSubmittedData(data);
            console.log("Popup should now display with data:", data);
            reset();
        } catch (error) {
            alert(error?"Employee Id or Email already exists":"Server Error");
            console.error("Error occurred during submission:", error);
            setMessage(error.response ? error.response.data.message : "Server Error");
        }
    };

    const renderInputField = (label, type, name, validationRules) => {
        return (
            <div>
                <label>{label}</label>
                <input type={type} {...register(name, validationRules)} />
                {errors[name] && <p>{errors[name].message}</p>}
            </div>
        );
    };

    const closePopup = () => {
        setSubmittedData(null);
    };

    return (
        <div>
            <div className="form-container">
                <h1>Employee Form</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {renderInputField("Name", "text", "empname", { required: "Name is Required" })}
                    {renderInputField("EmployeeId", "text", "empid", { required: "Employee Id is Required", maxLength: 10 })}
                    {renderInputField("Email", "text", "empmail", { required: "Email is Required" })}
                    {renderInputField("PhoneNumber", "text", "empphone", {
                        required: "Phone Number is Required",
                        pattern: { value: /^[0-9]{10}$/, message: "Phone number must be in 10 digits" }
                    })}
                    <div>
                        <label>Select Department</label>
                        <select {...register("empdept", { required: "Department must be selected" })}>
                            <option value={"HR"}>HR</option>
                            <option value={"Developer"}>Developer</option>
                            <option value={"Tester"}>Tester</option>
                        </select>
                        {errors.empdept && <p>{errors.empdept.message}</p>}
                    </div>
                    <div>
                        <label>Date of Joining</label>
                        <input
                            type="date"
                            {...register("empjoiningdate", {
                                required: "Joining date is required",
                                validate: value => new Date(value) <= new Date() || "Date cannot be in the future"
                            })}
                        />
                        {errors.empjoiningdate && <p>{errors.empjoiningdate.message}</p>}
                    </div>
                    {renderInputField("Role", "text", "emprole", { required: "Employee Role is Required" })}
                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => { reset(); }}>Reset</button>
                </form>
            </div>

            {submittedData && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Form Submitted Successfully</h2>
                        <p><strong>Name:</strong> {submittedData.empname}</p>
                        <p><strong>Employee ID:</strong> {submittedData.empid}</p>
                        <p><strong>Email:</strong> {submittedData.empmail}</p>
                        <p><strong>Phone Number:</strong> {submittedData.empphone}</p>
                        <p><strong>Department:</strong> {submittedData.empdept}</p>
                        <p><strong>Date of Joining:</strong> {submittedData.empjoiningdate}</p>
                        <p><strong>Role:</strong> {submittedData.emprole}</p>
                        <button onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeForm;
