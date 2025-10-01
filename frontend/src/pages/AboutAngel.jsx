import React from "react";
import "../AboutPages.css";
import "../index.css"
import {Link, useNavigate} from "react-router-dom";
import Navigation from "../components/nav.jsx";
import Footer from "../components/footer.jsx";

export function AboutAngel() {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/shop-page")
    };



    return (
        <div className="page">
            <Navigation />
            <div className="hero">
                <h1 className="hero-title">The Answer of Light – “The Angel”</h1>
                <p className="hero-subtext">
                    Soon after the creation and rejection of “The Demon,” a young apprentice of the elder masters decided to forge something that would carry the wisdom, not the power, of motion.
                    Thus, “The Angel” was born – a white trainer balisong, made not to wound, but to teach.
                </p>
                <p className="hero-subtext">
                    Its body was crafted from a smooth white composite – lightweight and without a sharp edge. It was the first knife that couldn’t kill, and in that lay its strength.
                    “The Angel” didn’t demand force, but harmony. It was pure, for it was forged with the intention to guide, not to control.
                </p>
                <p className="hero-subtext">
                    The masters accepted it instantly – it became a symbol of the student’s path.
                    While “The Demon” was denied, “The Angel” was exalted.
                </p>
                <p className="hero-subtext">
                    But the truth is – one cannot exist without the other.
                    Just as shadows have no meaning without light, so too is “The Angel” born from the need to counter “The Demon.”
                </p>
                <button className="cta-button" onClick={handleClick}>Acquire "The Angel"</button>
            </div>

            <Footer />
        </div>
    );
}
