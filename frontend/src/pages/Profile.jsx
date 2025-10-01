import React, {useEffect, useState} from "react";
import { Button } from "../components/button.jsx";
import "../index.css";
import Navigation from "../components/nav.jsx";
import Footer from "../components/footer.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function Profile() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        username: "",
        email: "",
    });

    useEffect(() => {
        const sessionCheck = async () => {
            try {
                const request = await axios.get("http://localhost:8080/check-session", { withCredentials: true });
                if (request.data.success) {
                     const userInfoResponse = await axios.get("http://localhost:8080/user_info_fetch", {withCredentials: true});
                     if (userInfoResponse.data.success) {
                         setUserData({
                             username: userInfoResponse.data.username,
                             email: userInfoResponse.data.email
                         });
                     }
                     else {
                         alert("Error fetching user data");
                     }
                }
                else{
                    alert("You are not logged in!");
                    navigate("/login");
                }
            } catch (err) {
                console.error(err);
            }
        };
        sessionCheck();
    }, [navigate]);



    function userDataChange() {
        navigate("/user-data-change");
    }

    /*
    function handleChange(e) {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        alert("Profile updated!");
    }
*/
    return (
        <div className="page">
            <Navigation />
            <div className="profile-hero">
                <h1 className="profile-title">Your Profile</h1>
                <p className="profile-subtext">Username: {userData.username}</p>
                <p className="profile-subtext">Email: {userData.email}</p>
                <button className="profile-button" onClick={userDataChange}>Change user data</button>
            </div>
            <Footer />
        </div>
    );
}
