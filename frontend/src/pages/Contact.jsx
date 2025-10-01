import React, { useState } from "react";
import { Button } from "../components/button.jsx";
import "../index.css";
import Navigation from "../components/nav.jsx";
import Footer from "../components/footer.jsx";
import axios from "axios";

export function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    function handleChange(e) {
        const { name, value } = e.target;
        if (name === "message" && value.length > 1000) return;

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const { name, email, message } = formData;
            const response = await axios.post(
                "http://localhost:8080/contact",
                { name, email, message },
                { withCredentials: true }
            );
            if (response.status === 200) {
                alert("Message received!");
                setFormData({ name: "", email: "", message: "" });
            } else {
                alert("Failed to send message.");
            }
        } catch (error) {
            console.error(error);
            alert("Error sending message.");
        }
    }

    return (
        <div className="page">
            <Navigation />
            <div className="hero">
                <h1 className="hero-title">Contact Us</h1>
                <p className="hero-subtext">
                    Reach out to the creators of Blade Souls!
                </p>

                <div className="contact-container">
                    <div className="contact-info">
                        <h3>Connect With Us</h3>
                        <p>Email: <a href="mailto:3dplasticbalis@gmail.com">3dplasticbalis@gmail.com</a></p>
                        <p>Twitter: <a href="https://twitter.com/bladesouls" target="_blank">@BladeSouls</a></p>
                        <p>Instagram: <a href="https://www.instagram.com/zen._.bite/" target="_blank">@zen._.bite</a></p>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <h3>Send Us a Message</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            maxLength={1000}
                            required
                        />
                        <p style={{color: "#dc143c"}}>{formData.message.length} / 1000 characters left in message</p>
                        <Button type="submit">Send Message</Button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
