// PasswordRecovery.jsx
import React, { useState } from "react";
import axios from "axios";
import Navigation from "../components/nav.jsx";
import Footer from "../components/footer.jsx";
import "../index.css";
import {useNavigate} from "react-router-dom";

export default function PasswordRecovery() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        backup_code: "",
        new_password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { username, backup_code, new_password } = formData;

        if (!username || !backup_code || !new_password) {
            alert("All fields are required!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/password-recovery",
                { username, backup_code, new_password },
                { withCredentials: true }
            );

            if (response.data.success) {
                alert("Password changed successfully!");
                navigate("/");
            } else {
                alert("Password change failed!");
                setFormData({ username: "", backup_code: "", new_password: "" });
            }
        } catch (err) {
            console.error(err);
            alert("Server error occurred!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <Navigation />

            <div className="profile-hero">
                <h1 className="profile-title">Recover / Change Password</h1>
                <form className="profile-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="backup_code"
                        placeholder="Backup Code"
                        value={formData.backup_code}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="new_password"
                        placeholder="New Password"
                        value={formData.new_password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="profile-button" disabled={loading}>
                        {loading ? "Processing..." : "Change Password"}
                    </button>
                </form>
            </div>

            <Footer />
        </div>
    );
}
