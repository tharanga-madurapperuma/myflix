import { useState, useEffect } from "react";
import { editUser, getUserDetails } from "../../../Api/api"; // Assume `getUserDetails` fetches user details
import Navbar from "../../../Components/Navbar/Navbar";

import "./edit.css";

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

const EditProfile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch user details on component load
  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
      const response = await getUserDetails(); // Fetch user details from the API
      const userData = response.user; // Access the `user` object from the response


      setEmail(userData.email);
      setFirstname(userData.first_name); 
      setLastname(userData.last_name); 
      } catch (error) {
        console.error("Error fetching user details:", error);
        setMessage("Failed to load user details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const updatedUser = await editUser(email, firstname, lastname, password);
      setMessage("User updated successfully");
      console.log("User updated successfully:", updatedUser);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="edit-container">
        {isLoading && <LoadingSpinner />}
        <div className="edit-card">
          <h2>Edit Profile</h2>
          <form className="auth-form" onSubmit={handleEditUser}>
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="edit-button">
              Edit Profile
            </button>
          </form>
          {message && <p className="error-message">{message}</p>}
        </div>
      </div>
    </>
  );
};

export default EditProfile;
export { LoadingSpinner };
