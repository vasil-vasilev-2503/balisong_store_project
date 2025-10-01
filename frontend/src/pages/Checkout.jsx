import React, { useState, useEffect } from "react";
import { Button } from "../components/button.jsx";
import "../index.css";
import Footer from "../components/footer.jsx";
import Navigation from "../components/nav.jsx";
import axios from "axios";

export function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [customer, setCustomer] = useState({ name: "", email: "", address: "" });
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Load cart and fetch latest product info (id, name, price) from backend
    useEffect(() => {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

        if (!localCart.length) {
            setCartItems([]);
            setTotal(0);
            setLoading(false);
            return;
        }

        const fetchPrices = async () => {
            try {
                const { data } = await axios.post(
                    "http://localhost:8080/cart-prices",
                    { ids: localCart.map(item => item.id) },
                    { withCredentials: true }
                );

                // Merge backend product info with local quantities
                const mergedCart = localCart.map(item => {
                    const dbItem = data.find(p => p.id === item.id);
                    return {
                        id: item.id,
                        quantity: item.quantity,
                        name: dbItem?.name || "Unknown product",
                        price: dbItem?.price || 0
                    };
                });

                setCartItems(mergedCart);

                const totalValue = mergedCart.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );
                setTotal(totalValue);
            } catch (err) {
                console.error("Error fetching product prices:", err);
                setCartItems([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };

        fetchPrices();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cartItems.length) return alert("Cart is empty!");

        try {
            const { data } = await axios.post(
                "http://localhost:8080/create-checkout-session",
                {
                    customer,
                    cart: cartItems.map(item => ({
                        id: item.id,
                        quantity: item.quantity
                    }))
                },
                { withCredentials: true }
            );

            if (data.url) {
                // Clear cart and redirect to Stripe Checkout
                localStorage.removeItem("cart");
                document.cookie = "cart=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                window.location.href = data.url;
            } else {
                alert("Failed to start checkout. Please try again.");
            }
        } catch (err) {
            console.error("Checkout error:", err);
            alert("Error starting checkout. Please try again.");
        }
    };

    if (loading) return <p>Loading cart...</p>;

    return (
        <div className="page">
            <Navigation />

            <h1 className="hero-title">Checkout</h1>

            <div className="checkout-container">
                <div className="checkout-summary">
                    <h2>Order Summary</h2>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="checkout-item">
                                <span>{item.name} × {item.quantity}</span>
                                <span>{(item.price * item.quantity).toFixed(2)} BGN</span>
                            </div>
                        ))
                    )}
                    <p className="checkout-total">Total: ${total.toFixed(2)}</p>
                </div>

                <form className="checkout-form" onSubmit={handleSubmit}>
                    <h2>Shipping Details</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={customer.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={customer.email}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Shipping Address"
                        value={customer.address}
                        onChange={handleInputChange}
                        required
                    />
                    <Button type="submit">Proceed to Payment</Button>
                </form>
            </div>

            <Footer />
        </div>
    );
}
