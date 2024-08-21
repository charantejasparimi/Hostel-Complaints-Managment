import React, { useState } from "react";
import UserForm from "./UserForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Signin.css";
const Signin = () => {
  const navigate = useNavigate();
  const [frm, setFrm] = useState({
    firstname: "",
    lastname: "",
    hostel: "",
    room: "",
    email: "",
    password: "",
    role: "student", // default value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFrm((prevFrm) => ({ ...prevFrm, [name]: value }));
  };
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${apiUrl}/api/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(frm),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("token", JSON.stringify(data.token));
        localStorage.setItem("role", data.role);
        console.log("Success:", data);
        toast.success("Sign in successful!");
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Sign in failed.");
      });
  };

  return (
    <div>
      <UserForm
        frm={frm}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText="Sign In"
      />
    </div>
  );
};

export default Signin;
