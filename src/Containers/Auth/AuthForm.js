import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authenticateUser } from "../../Api/api";
import { handleAuthenticationSuccess } from "../../Api/api";
import NotFound from "../../Components/NotFound/NotFound";

import "./authform.css";
const LoadingSpinner = () => (
    <div className="loading-spinner">
        <div className="spinner"></div>
    </div>
);

const AuthForm = () => {
    const { mode } = useParams();
    const navigate = useNavigate();
    // Declare all state hooks here, before any conditional logic
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState(""); // Used only for signup
    const [lastname, setLastname] = useState(""); // Used only for signup
    const [isLoading, setIsLoading] = useState(false);

    // Check if the mode is valid
    const validModes = ["login", "signup"];
    const currentMode = validModes.includes(mode) ? mode : null;

    if (!currentMode) {
        // If mode is invalid, render the 404 page
        return <NotFound />;
    }

    const handleAuth = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authenticateUser(
                mode,
                email,
                password,
                firstname,
                lastname
            );
            console.log(
                `${mode === "login" ? "Login" : "Signup"} successful`,
                response
            );

            // On successful login/signup, handle token storage and navigation
            handleAuthenticationSuccess(mode, response.token, navigate);
            setEmail("");
            setPassword("");
            setFirstname("");
            setLastname("");
        } catch (error) {
            console.error(`Error during ${mode}`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            {isLoading && <LoadingSpinner />}
            <div className="login-card">
                <h2>{currentMode === "login" ? "LOGIN" : "SIGN UP"}</h2>
                <form className="auth-form" onSubmit={handleAuth}>
                    <div>
                        {currentMode === "signup" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstname}
                                    onChange={(e) =>
                                        setFirstname(e.target.value)
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastname}
                                    onChange={(e) =>
                                        setLastname(e.target.value)
                                    }
                                    required
                                />
                            </>
                        )}
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
                    <button type="submit" className="login-button">
                        {currentMode === "login" ? "Log In" : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
export { LoadingSpinner };
