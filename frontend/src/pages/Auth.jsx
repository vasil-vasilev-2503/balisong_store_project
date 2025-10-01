// AuthPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navigation from "../components/nav.jsx";
import Footer from "../components/footer.jsx";
import { Input } from "../components/inputs.jsx";
import { Label } from "../components/labels.jsx";
import "../index.css";

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        const sessionCheck = async () => {
            try {
                const request = await axios.get("http://localhost:8080/check-session", { withCredentials: true });
                if (request.data.success) {
                    navigate("/home");
                }
            } catch (err) {
                console.error(err);
            }
        };
        sessionCheck();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const { username, password } = formData;
                if (!username || !password) {
                    alert("Please enter all fields to proceed with logging in!");
                    return;
                }
                const response = await axios.post(
                    "http://localhost:8080/login",
                    { username, password },
                    { withCredentials: true }
                );
                if (response.data.success) {
                    alert("Logged in successfully!");
                    navigate("/home");
                } else {
                    alert("The provided username doesn't exist or the provided password doesn't match!");
                }
            } else {
                const { username, password, email } = formData;
                if (!username || !password || !email) {
                    alert("Please fill all fields to register!");
                    return;
                }
                const response = await axios.post(
                    "http://localhost:8080/register",
                    { username, password, email }
                );
                if (response.data.success) {
                    alert("Registered successfully! Save your backup code(for password recovery):\n" + response.data.backupCode);
                    setIsLogin(true);
                    setFormData({ username: "", password: "", email: "" });
                } else {
                    alert("Attempt to register was unsuccessful!");
                }
            }
        } catch (err) {
            console.error(err);
            alert("Server error occurred!");
        }
    };

    return (
        <div className="auth-page">
            <Navigation />
            <div className="auth-form-wrapper">
                <form onSubmit={handleSubmit}>
                    <p className="auth-form-title">{isLogin ? "Login Form" : "Register Form"}</p>

                    <Label text="Username" htmlForAttribute="username" auth />
                    <Input type="text" id="username" value={formData.username} onChange={handleChange} auth />

                    <Label text="Password" htmlForAttribute="password" auth />
                    <Input type="password" id="password" value={formData.password} onChange={handleChange} auth />

                    {!isLogin && (
                        <>
                            <Label text="Email" htmlForAttribute="email" auth />
                            <Input type="email" id="email" value={formData.email} onChange={handleChange} auth />
                        </>
                    )}

                    <button type="submit" className="auth-button" >
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>

                <button
                    className="auth-toggle-btn"
                    type="button"
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setFormData({ username: "", password: "", email: "" });
                    }}
                >
                    {isLogin ? "Register instead" : "Login instead"}
                </button>
            </div>
            <Footer />
        </div>
    );
};
