import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";
import { authenticateUser } from "../../Api/api";
import NotFound from "../../Components/NotFound/NotFound";

import "./authform.css";

const LoadingSpinner = () => (
    <div className="loading-spinner">
        <div className="spinner"></div>
    </div>
);

const AuthForm = () => {
    const { mode } = useParams();
    const { login, signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        setEmail("");
        setPassword("");
        setFirstname("");
        setLastname("");
    }, [mode]);

    const validModes = ["login", "signup"];
    const currentMode = validModes.includes(mode) ? mode : null;

    if (!currentMode) {
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

            // Use the context's login or signup methods based on the mode
            if (mode === "signup") {
                signup(response.token); // Provided by AuthContext
            } else {
                login(response.token); // Provided by AuthContext
            }

            // Clear form fields after successful authentication
            setEmail("");
            setPassword("");
            setFirstname("");
            setLastname("");
        } catch (error) {
            setError("An error occurred. Please try again.");
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
                <div className="switch-container">
                    <p>
                        {currentMode === "login"
                            ? "Don't have an account?"
                            : "Already have an account?"}
                        <span
                            className="auth-switch"
                            onClick={() =>
                                navigate(
                                    currentMode === "login"
                                        ? "/auth/signup"
                                        : "/auth/login"
                                )
                            }
                        >
                            {currentMode === "login" ? " Sign Up" : " Log In"}
                        </span>
                    </p>
                </div>
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthForm;
export { LoadingSpinner };
