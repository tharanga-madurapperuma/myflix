import { useState } from "react";
import { editUser } from "../../../Api/api";
import Navbar from "../../../Components/Navbar/Navbar"


import "./edit.css";

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

const EditProfile  = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState(""); // Used only for signup
  const [lastname, setLastname] = useState(""); // Used only for signup
  const [isLoading, setIsLoading] = useState(false);



  const handleEditUser = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    try {
      setIsLoading(true);
      const updatedUser = await editUser(email, firstname, lastname, password);
      console.log("User updated successfully:", updatedUser);
      // Optionally update local state or navigate to another page
    } catch (error) {
      console.error("Error updating user:", error);
      // Optionally display an error message to the user
    }
    finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
    <Navbar/>
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
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="edit-button">
            Edit Profile
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default EditProfile;
export { LoadingSpinner };
