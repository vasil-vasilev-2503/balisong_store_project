import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/nav.jsx";
import Footer from "../components/footer.jsx";
import "../index.css";

export const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedAnimation, setAddedAnimation] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:8080/products");
                const formatted = res.data.products.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: Number(p.price),
                    img: p.image_url
                }));
                setProducts(formatted);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        setAddedAnimation(true);
        setTimeout(() => setAddedAnimation(false), 800);
    };

    return (
        <div className="shop-page">
            <Navigation />
            <div className="shop-hero">
                <h1 className="shop-title">Our Blades</h1>
                <p className="shop-subtext">
                    Choose your weapon – forged for skill, precision, and style.
                </p>
            </div>

            {addedAnimation && <div className="shop-added-animation">Added to Cart!</div>}

            {loading ? (
                <p className="shop-loading">Loading products...</p>
            ) : (
                <div className="shop-grid">
                    {products.map(product => (
                        <div key={product.id} className="shop-card">
                            <img
                                src={product.img}
                                alt={product.name}
                                className="shop-card-img"
                            />
                            <div className="shop-card-body">
                                <h3 className="shop-card-name">{product.name}</h3>
                                <p className="shop-card-price">{product.price.toFixed(2)} BGN</p>
                                <button
                                    className="shop-card-btn"
                                    onClick={() => addToCart(product)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Footer />
        </div>
    );
};
