import express from 'express';
import cookieSession from 'cookie-session';
import {userRouter} from "./main_files/userRouter.js";
import cors from "cors";
import Stripe from "stripe";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieSession({
    name: "cookie-session",
    keys: [process.env.COOKIE_SESSION_KEY],
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    path: '/'
}));


import mysql from 'mysql2/promise';
export const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_NAME,
    dateStrings: true
});





const limiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 1,
    message: { error: "You can only send 1 message every 30 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/contact", limiter);



export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];
        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error("Webhook signature verification failed:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const userId = parseInt(session.metadata.userIde);
            const customerName = session.metadata.customerName || "";
            const customerEmail = session.customer_details?.email || "";
            const customerAddress = session.metadata.customerAddress || "";
            try {
                await db.query(
                    "INSERT INTO orders (user_id, customer_name, customer_email, address) VALUES (?, ?, ?, ?)",
                    [userId, customerName, customerEmail, customerAddress]
                );
                console.log(`Order for user ${userId} inserted successfully.`);
            } catch (dbErr) {
                console.error("Error inserting order:", dbErr);
            }
        }

        res.json({ received: true });
    }
);




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("C:\\Users\\ASUS\\Desktop\\balisong_store\\frontend"));
app.use(userRouter);

app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    console.log("New Contact Form Submission:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);
    console.log("\n");

    res.json({ success: true});
});



app.listen(8080, () => console.log('Server running on port 8080'));
