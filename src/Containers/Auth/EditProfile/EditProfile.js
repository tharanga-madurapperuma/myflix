import { useState, useEffect,useContext } from "react";
import { editUser, getUserDetails } from "../../../Api/api"; // Assume `getUserDetails` fetches user details
import Navbar from "../../../Components/Navbar/Navbar";
import AuthContext from "../../../Context/AuthContext";

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
    const { user,setUser } = useContext(AuthContext);

     useEffect(() => {
        setIsLoading(true);
            if (user) {
                setEmail(user.email);
                setFirstname(user.first_name);
                setLastname(user.last_name);
                setIsLoading(false);
            } else {

                console.log("User is Loading");
            }
        
        }, [user]);

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const updatedUser = await editUser(
                email,
                firstname,
                lastname,
                password
            );
         
            setMessage("User updated successfully");
            setUser(prevUser => ({
                ...prevUser, 
                first_name: firstname, 
            }));
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
