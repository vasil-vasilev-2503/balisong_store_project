import "../index.css";
import React from "react";
import {Link} from "react-router-dom";

    export default function Navigation() {
    return (
        <nav className="navbar">
            <Link to="/home" className="logo">Blade souls</Link>
            <div className="nav-links">
                <Link to="/home" className="nav-link">Home</Link>
                <Link to="/shop-page" className="nav-link">Shop</Link>
                <Link to="/profile" className="nav-link">Profile</Link>
                <Link to="/cart" className="nav-link">Cart</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
            </div>
        </nav>
    )
}