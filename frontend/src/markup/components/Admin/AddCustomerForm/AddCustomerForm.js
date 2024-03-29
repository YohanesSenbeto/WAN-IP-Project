import React, { useState } from "react";
// import customer.service.js
import customerService from "../../../../services/customer.service";
// Import the useAuth hook
import { useAuth } from "../../../../Contexts/AuthContext";

function AddcustomerForm(props) {
  const [customer_email, setEmail] = useState("");
  const [customer_first_name, setFirstName] = useState("");
  const [customer_last_name, setLastName] = useState("");
  const [customer_phone, setPhoneNumber] = useState("");
  const [customer_password, setPassword] = useState("");
  const [active_customer, setActive_customer] = useState(1);
  const [company_role_id, setCompany_role_id] = useState(1);
  // Errors
  const [emailError, setEmailError] = useState("");
  const [firstNameRequired, setFirstNameRequired] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  // Create a variable to hold the user's token
  let loggedIncustomerToken = "";
  // Destructure the auth hook and get the token
  const { customer } = useAuth();
  if (customer && customer.customer_token) {
    loggedIncustomerToken = customer.customer_token;
  }

  const handleSubmit = (e) => {
    // Prevent the default behavior of the form
    e.preventDefault();
    // Handle client side validations
    let valid = true; // Flag
    // First name is required
    if (!customer_first_name) {
      setFirstNameRequired("First name is required");
      valid = false;
    } else {
      setFirstNameRequired("");
    }
    // Email is required
    if (!customer_email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!customer_email.includes("@")) {
      setEmailError("Invalid email format");
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(customer_email)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }
    // Password has to be at least 6 characters long
    if (!customer_password || customer_password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }
    // If the form is not valid, do not submit
    if (!valid) {
      return;
    }
    const formData = {
      customer_email,
      customer_first_name,
      customer_last_name,
      customer_phone,
      customer_password,
      active_customer,
      company_role_id,
    };
    // Pass the form data to the service
    const newcustomer = customerService.createcustomer(formData, loggedIncustomerToken);
    newcustomer
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        // If Error is returned from the API server, set the error message
        if (data.error) {
          setServerError(data.error);
        } else {
          // Handle successful response
          setSuccess(true);
          setServerError("");
          // Redirect to the customers page after 2 seconds
          // For now, just redirect to the home page
          setTimeout(() => {
            // window.location.href = '/admin/customers';
            window.location.href = "/";
          }, 2000);
        }
      })
      // Handle Catch
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setServerError(resMessage);
      });
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Add a new customer</h2>
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
                        type="email"
                        name="customer_email"
                        value={customer_email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="customer email"
                      />
                      {emailError && (
                        <div className="validation-error" role="alert">
                          {emailError}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_first_name"
                        value={customer_first_name}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder="customer first name"
                      />
                      {firstNameRequired && (
                        <div className="validation-error" role="alert">
                          {firstNameRequired}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_last_name"
                        value={customer_last_name}
                        onChange={(event) => setLastName(event.target.value)}
                        placeholder="customer last name"
                        required
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_phone"
                        value={customer_phone}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        placeholder="customer phone (555-555-5555)"
                        required
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <select
                        name="customer_role"
                        value={company_role_id}
                        onChange={(event) =>
                          setCompany_role_id(event.target.value)
                        }
                        className="custom-select-box"
                      >
                        <option value="1">customer</option>
                        <option value="2">Manager</option>
                        <option value="3">Admin</option>
                      </select>
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="password"
                        name="customer_password"
                        value={customer_password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="customer password"
                      />
                      {passwordError && (
                        <div className="validation-error" role="alert">
                          {passwordError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>Add customer</span>
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

export default AddcustomerForm;
