import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/nav.jsx";
import Footer from "../components/footer.jsx";
import "../index.css";
import axios from "axios";

export function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(cart);

        if (cart.length > 0) {
            fetchTotal(cart);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchTotal = async (cart) => {
        try {
            const { data } = await axios.post("http://localhost:8080/cart-total", {
                items: cart.map(item => ({ id: item.id, quantity: item.quantity }))
            });
            setTotal(data.total);
        } catch (err) {
            console.error("Error fetching total:", err);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = (id) => {
        const filtered = cartItems.filter(item => item.id !== id);
        setCartItems(filtered);
        localStorage.setItem("cart", JSON.stringify(filtered));

        if (filtered.length > 0) fetchTotal(filtered);
        else setTotal(0);
    };

    const updateQuantity = (id, delta) => {
        const updated = cartItems.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        );
        setCartItems(updated);
        localStorage.setItem("cart", JSON.stringify(updated));

        fetchTotal(updated);
    };

    const handleCheckout = () => navigate("/checkout");

    if (loading) return <p>Loading cart...</p>;

    return (
        <div className="page">
            <Navigation />
            <h1 className="hero-title">Your Cart</h1>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <span>{item.name}</span>
                            <div className="cart-actions">
                                <div className="cart-quantity">
                                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                </div>
                                <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {cartItems.length > 0 && (
                <div className="cart-summary">
                    <p className="checkout-total-header">Total: {total.toFixed(2)} BGN</p>
                    <button className="cta-button" onClick={handleCheckout}>Proceed to Checkout</button>
                </div>
            )}
            <Footer />
        </div>
    );
}
