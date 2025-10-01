import React from "react";
import "../AboutPages.css";
import "../index.css"
import {Link, useNavigate} from "react-router-dom";
import Navigation from "../components/nav.jsx";
import Footer from "../components/footer.jsx";

export function AboutDemon() {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/shop-page")
    };



    return (
        <div className="page">
            <Navigation />
            <div className="hero">
                <h1 className="hero-title">The Firstborn – "The Demon"</h1>
                <p className="hero-subtext">
                    At the very beginning, when the art of balisongs was still in its infancy, the first knife was forged – now known as “The Demon.”
                    Born from the hands of an ambitious master, it was not created for training, but for power. Its sharp design, black form, and unnatural aura scared even the blacksmith who forged it.
                </p>
                <p className="hero-subtext">
                    “The Demon” was technically perfect – balanced, razor-sharp, and beautiful in its dark aesthetic. But it was not accepted.
                    The elder masters rejected it: “This is not a tool for the path. This is a demon sealed in metal.”
                </p>
                <p className="hero-subtext">
                    No one wanted to hold it for long – they say the knife whispered in your hand. That it stirred anger, impatience, pride.
                    Abandoned, but not forgotten, “The Demon” was locked away in a deep box – perfect, yet unwanted. Alone.
                </p>
                <button className="cta-button" onClick={handleClick}>Acquire "The Demon"</button>
            </div>

            <Footer />
        </div>
    );
}
