import React, {useEffect} from "react";
import { Button } from "../components/button.jsx";
import "../index.css";
import {Link, useNavigate} from "react-router-dom";
import Navigation from "../components/nav.jsx";
import Footer from "../components/footer.jsx";
import axios from "axios";

export default function HomePage() {

    const navigate = useNavigate();

    useEffect(() => {
        const sessionCheck = async () => {
            try {
                const request = await axios.get("http://localhost:8080/check-session", { withCredentials: true });
                if (!request.data.success) {
                    navigate("/");
                }
            } catch (err) {
                console.error(err);
            }
        };
        sessionCheck();
    }, [navigate]);



    return (
        <main className="page">
            <Navigation />
            <section className="hero">
                <h1 className="hero-title">Unfold the Legend</h1>
                <p className="hero-subtext">
                    Two blades. Two stories. Choose your path.
                </p>

                <div className="variants">
                    <div className="card">
                        <img
                            src="/assets/bali_1.jpg"
                            alt="balisong angel variant"
                            className="card-img"
                        />
                        <div className="overlay">
                            <Link to="/about-angel">
                                <Button className="cta-button">Angel lore</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="card">
                        <img
                            src="/assets/bali_1.jpg"
                            alt="balisong demon variant"
                            className="card-img"
                        />
                        <div className="overlay">
                            <Link to="/about-demon">
                                <Button className="cta-button">Demon lore</Button>
                            </Link>
                        </div>
                    </div>

                    {/*
          <div className="card">
            <img
              src="/assets/bali_1.jpg"
              alt="balisong hybrid variant"
              className="card-img"
            />
            <div className="overlay">
              <Link to="/about-variant-c">
                <Button className="cta-button">Hybrid lore</Button>
              </Link>
            </div>
          </div>
          */}
                </div>
            </section>

            <Footer />
        </main>
    );
}
