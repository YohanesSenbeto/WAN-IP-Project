import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import signupService from "../../../services/signup.service";

function SignupForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user_name, setName] = useState("");
  const [user_email, setEmail] = useState("");
  const [user_password, setPassword] = useState("");
  const [user_city, setCity] = useState("");
  const [user_subcity, setSubcity] = useState("");
  const [user_phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Handle client-side validations here
    let valid = true; // Flag

    // Name validation
    if (!user_name) {
      setNameError("Please enter your name");
      valid = false;
    } else {
      setNameError("");
    }

    // Email validation
    if (!user_email) {
      setEmailError("Please enter your email address");
      valid = false;
    } else if (!user_email.includes("@")) {
      setEmailError("Invalid email format");
      valid = false;
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(user_email)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }

    // Password validation (must be at least 6 characters long)
    if (!user_password || user_password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }

    // Handle form submission here
    if (valid) {
      const formData = {
        user_name,
        user_email,
        user_password,
        user_city,
        user_subcity,
        user_phone,
      };

      // Call the service for user signup
      const signupUser = signupService.signUp(formData);

      signupUser
        .then((response) => response.json())
        .then((response) => {
          if (response.status === "success") {
            // Save the user in the local storage
            if (response.data.user_token) {
              localStorage.setItem("user", JSON.stringify(response.data));
            }
            // Redirect the user to the dashboard or homepage
            if (location.pathname === "/signup") {
              window.location.replace("/login");
            } else {
              window.location.reload();
            }
          } else {
            // Show an error message
            setServerError(response.message);
          }
        })
        .catch((err) => {
          setServerError(
            "An error has occurred. Please try again later." + err
          );
        });
    }
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Create a new account</h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                      {serverError && (
                        <div className="validation-error" role="alert">
                          {serverError}
                        </div>
                      )}
                      <input
                        type="text"
                        name="user_name"
                        value={user_name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="User Name"
                      />
                      {nameError && (
                        <div className="validation-error" role="alert">
                          {nameError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      {serverError && (
                        <div className="validation-error" role="alert">
                          {serverError}
                        </div>
                      )}
                      <input
                        type="email"
                        name="user_email"
                        value={user_email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email"
                      />
                      {emailError && (
                        <div className="validation-error" role="alert">
                          {emailError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="password"
                        name="user_password"
                        value={user_password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                      />
                      {passwordError && (
                        <div className="validation-error" role="alert">
                          {passwordError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="user_city"
                        value={user_city}
                        onChange={(event) => setCity(event.target.value)}
                        placeholder="City (optional)"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="user_subcity"
                        value={user_subcity}
                        onChange={(event) => setSubcity(event.target.value)}
                        placeholder="Subcity (optional)"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="tel"
                        name="user_phone"
                        value={user_phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="Phone Number (optional)"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>Sign Up</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignupForm;