import React, { useState, useEffect } from "react";
import Navigation from "../components/nav.jsx";
import Footer from "../components/footer.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserDataChange() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
    });

    const [originalData, setOriginalData] = useState({
        username: "",
        email: "",
    });

    useEffect(() => {
        // Fetch current user info to prefill form
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/user_info_fetch", { withCredentials: true });
                if (response.data.success) {
                    setFormData({
                        username: response.data.username,
                        email: response.data.email,
                    });
                    setOriginalData({
                        username: response.data.username,
                        email: response.data.email,
                    });
                } else {
                    alert("Failed to fetch user data.");
                    navigate("/profile");
                }
            } catch (err) {
                console.error(err);
                navigate("/profile");
            }
        };
        fetchUserData();
    }, [navigate]);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const payload = {};
        if (formData.username !== originalData.username) payload.username = formData.username;
        if (formData.email !== originalData.email) payload.email = formData.email;

        if (Object.keys(payload).length === 0) {
            alert("No changes detected.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/update_user_data",
                payload,
                { withCredentials: true }
            );
            if (response.data.success) {
                alert("User data updated!");
                navigate("/profile");
            } else {
                alert("Failed to update user data.");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating user data.");
        }
    }

    function passwordChangeHandle() {
        navigate("/password-recovery");
    }

    return (
        <div className="page">
            <Navigation />
            <div className="profile-hero">
                <h1 className="profile-title">Change Your Data</h1>
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
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <p className="profile-small-text">
                        Leave the input field to its default value if you do not want to change it
                    </p>
                    <button className="profile-button" onClick={passwordChangeHandle}>Change password</button>
                    <button type="submit" className="profile-button">
                        Save Changes
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}
