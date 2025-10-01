import React from "react";
import "../index.css";

export function Button({ children, className = "", ...props }) {
    return (
        <button
            {...props}
            className={`cta-button ${className}`}
        >
            {children}
        </button>
    );
}