// import { useState } from "react";
// import API from "../api/api";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import "../styles/Auth.css"; // Re-using the same auth styles
// import "../styles/Register.css";

// const Register = () => {
//   const [isJoining, setIsJoining] = useState(false);
//   const [form, setForm] = useState({ name: "", email: "", password: "", familyName: "", familyCode: "" });
//   const [error, setError] = useState("");
//   const { login } = useAuth(); // Get the login function from the context

//   const handleToggle = () => {
//     setIsJoining(!isJoining);
//     setError("");
//     setForm({ name: "", email: "", password: "", familyName: "", familyCode: "" });
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     const endpoint = isJoining ? "/auth/register/join" : "/auth/register/new";
//     const payload = isJoining
//       ? { name: form.name, email: form.email, password: form.password, familyCode: form.familyCode }
//       : { name: form.name, email: form.email, password: form.password, familyName: form.familyName };

//     try {
//       const { data } = await API.post(endpoint, payload);
//       // FIX: Always log the user in on successful registration.
//       // The backend now sends the same data structure for all auth paths.
//       login(data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed. Please try again.");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form onSubmit={handleSubmit} className="register-form auth-form">
//         <h2 className="auth-title">{isJoining ? "Join a Family" : "Create a Family"}</h2>
//         {error && <p className="error-message">{error}</p>}
//         <input name="name" placeholder="Your Name" required onChange={handleChange} className="auth-input" />
//         <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="auth-input" />
//         <input name="password" type="password" placeholder="Password (min. 6 characters)" required onChange={handleChange} className="auth-input" minLength="6" />
        
//         {isJoining ? (
//           <input name="familyCode" placeholder="Family Code" required onChange={handleChange} className="auth-input" />
//         ) : (
//           <input name="familyName" placeholder="New Family Name (e.g., The Smiths)" required onChange={handleChange} className="auth-input" />
//         )}
        
//         <button type="submit" className="auth-button">{isJoining ? "Join & Enter" : "Create & Enter"}</button>
        
//         <p className="auth-switch" onClick={handleToggle}>
//           {isJoining ? "Want to create a new family?" : "Already have a family code?"}
//         </p>

//         <p className="auth-switch" style={{marginTop: 0}}>
//           Already have an account? <Link to="/login">Login here</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Register;




import { useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Import the new phone number input component and its styles
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import "../styles/Auth.css"; // Your existing auth styles
import "../styles/Register.css"; // Your existing register styles

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", familyName: "", familyCode: "" });
  const [mobileNumber, setMobileNumber] = useState(""); // State specifically for the phone number
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleToggle = () => {
    setIsJoining(!isJoining);
    setError("");
    setForm({ name: "", email: "", password: "", familyName: "", familyCode: "" });
    setMobileNumber("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- ADDED: Phone number validation ---
    if (!isValidPhoneNumber(mobileNumber)) {
        setError("Please enter a valid mobile number.");
        return;
    }
    // ------------------------------------

    const endpoint = isJoining ? "/auth/register/join" : "/auth/register/new";
    
    const payload = isJoining
      ? { ...form, mobileNumber }
      : { name: form.name, email: form.email, password: form.password, familyName: form.familyName, mobileNumber };

    try {
      const { data } = await API.post(endpoint, payload);
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="register-form auth-form">
        <h2 className="auth-title">{isJoining ? "Join a Family" : "Create a Family"}</h2>
        {error && <p className="error-message">{error}</p>}
        <input name="name" placeholder="Your Name" required onChange={handleChange} className="auth-input" />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="auth-input" />
        <input name="password" type="password" placeholder="Password (min. 6 characters)" required onChange={handleChange} className="auth-input" minLength="6" />
        
        {/* --- REPLACED THE OLD INPUT WITH THIS COMPONENT --- */}
        <div className="phone-input-container">
            <PhoneInput
              international
              defaultCountry="IN"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={setMobileNumber}
              className="phone-input"
            />
        </div>
        {/* ---------------------------------------------------- */}
        
        {isJoining ? (
          <input name="familyCode" placeholder="Family Code" required onChange={handleChange} className="auth-input" />
        ) : (
          <input name="familyName" placeholder="New Family Name (e.g., The Smiths)" required onChange={handleChange} className="auth-input" />
        )}
        
        <button type="submit" className="auth-button">{isJoining ? "Join & Enter" : "Create & Enter"}</button>
        
        <p className="auth-switch" onClick={handleToggle}>
          {isJoining ? "Want to create a new family?" : "Already have a family code?"}
        </p>

        <p className="auth-switch" style={{marginTop: 0}}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
