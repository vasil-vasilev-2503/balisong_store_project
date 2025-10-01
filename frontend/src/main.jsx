import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./pages/App.jsx";
import {AboutDemon} from "./pages/AboutDemon.jsx";
import {AboutAngel} from "./pages/AboutAngel.jsx";
import {Checkout} from "./pages/Checkout.jsx";
import {Cart} from "./pages/Cart.jsx";
import {Profile} from "./pages/Profile.jsx";
import {Contact} from "./pages/Contact.jsx";
import {AuthPage} from "./pages/Auth.jsx";
import {ShopPage} from "./pages/Shop.jsx";
import UserDataChange from "./pages/UserDataChange.jsx";
import PasswordRecovery from "./pages/PasswordRecovery.jsx";

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/home" element={<App />} />
                <Route path="/about-angel" element={<AboutAngel />} />
                <Route path="/about-demon" element={<AboutDemon />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shop-page" element={<ShopPage />} />
                <Route path="/user-data-change" element={<UserDataChange />} />
                <Route path="/password-recovery" element={<PasswordRecovery />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);