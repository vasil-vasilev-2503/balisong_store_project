import dotenv from "dotenv";
dotenv.config();
import express from "express";
import crypto from "crypto";
import {UserController} from "./userController.js";
import {passwordValidation} from "./helperFunctions.js";
import {db} from "../server.js";
import {stripe} from "../server.js";
import {generateBackupCode} from "./helperFunctions.js";

const userController = new UserController();
export const userRouter = express.Router();


userRouter.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    let routerLogin = await userController.controllerLogin(hashedPassword, username);
    if (!routerLogin) {
        res.send({
            success: false,
            message: 'Login failed!'
        })
        return;
    }

    const [rows]  = await db.query(
        "SELECT id FROM accounts WHERE username = ?",
         username
    );
    const user_id = rows[0].id;
    req.session = {user: {username}, user_id: {user_id}};
    res.send({
        success: true,
        message: 'Logged in successfully!'
    })
});

userRouter.post("/register", async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.send({ success: false, message: "All profile fields are required!" });
    }

    if (!passwordValidation(password)) {
        return res.send({ success: false, message: "The password must be at least 8 symbols long!" });
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    let existingUsers = await userController.controllerGetAllUsers();
    if (existingUsers.includes(username)) {
        return res.send({ success: false, message: "Duplicate username!" });
    }

    const newUserId = await userController.controllerRegister(hashedPassword, username, email);
    if (newUserId === false) {
        return res.send({ success: false, message: "Register failed!" });
    }
    else {
        const backupCode = generateBackupCode();
        const codeHash = crypto.createHash("sha256").update(backupCode).digest("hex");
        const backupCodesQuery = await userController.controllerBackupCodes(newUserId, codeHash);
        if(backupCodesQuery === 1) {
                res.status(200).send({
                    success: true,
                    message: "Backup code was inserted successfully in the database!",
                    backupCode
                });
            }
        else {
                res.status(500).send({
                    success: false,
                    message: "Backup code insertion failed!",
                });
        }
    }
});


userRouter.get("/user_info_fetch", async (req, res) => {
    if (req.session) {
        const usernameRequest = req.session.user.username;
        let emailFetchVariable = await userController.controllerEmailFetch(usernameRequest);
        res.send({
            success: true,
            username: usernameRequest,
            email: emailFetchVariable
        })
    } else {
        res.send({
            success: false,
        })
    }
});


userRouter.post("/logout", (req, res) => {
    if(!req.session?.user) {
        res.send({
            success: false
        })
        return;
    }
    if (req.session?.user) {
        req.session = null;
        res.send({
            success: true
        })
    }
});


userRouter.post("/password-recovery", async (req, res) => {
    const { username, backup_code, new_password } = req.body;

    if (!username || !backup_code || !new_password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    if (!passwordValidation(new_password)) {
        return res.status(400).json({
            success: false,
            message: "The password must be at least 8 symbols long!"
        });
    }

    try {
        const user_id = await userController.controllerGetUserId(username);
        if (!user_id) {
            return res.status(404).json({
                success: false,
                message: "User id not found"
            });
        }

        const hashedCode = crypto.createHash("sha256").update(backup_code).digest("hex");
        const userBackupCode = await userController.controllerGetUserBackupCode(user_id);
        if (!userBackupCode || userBackupCode.length === 0) {
            return res.status(404).json({
                success: false,
                message: "The backup code for the user was already used!"
            });
        }

        const codesCheck = userBackupCode.find(c => c.code_hash === hashedCode);
        if(!codesCheck) {
            return res.status(400).json({
                success: false,
                message: "No backup codes in the database match the provided code!"
            })
        }
        else{
            const hashedPassword = crypto.createHash("sha256").update(new_password).digest("hex");
            const passwordChange = await userController.controllerPasswordChange(hashedPassword, username);
            const backupCodeMark = await userController.controllerMarkBackupCodeUsed(codesCheck.id);
            if(!passwordChange || !backupCodeMark) {
                return res.status(500).json({
                    success: false,
                    message: "Password changed was unsuccessful!"
                });
            }
            req.session = null;
            return res.status(200).json({
                success: true,
                message: "Password changed was successful!"
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});



/*
userRouter.post("/change_password", async (req, res) => {
    if (!req.session?.user) {
        res.send({
            success: false
        })
        return;
    }
    const newPassword = req.body.new_password;
    const username = req.session.user.username;
    if (newPassword === "") {
        res.send({
            success: false,
            message: 'You must enter a password!'
        })
    }
    if(!passwordValidation(newPassword)) {
        res.send({
            success: false,
            message: 'The password must be at least 8 symbols long!'
        })
    }
    const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
    let routerChangePassword = await userController.controllerPasswordChange(hashedPassword, username);
    if (routerChangePassword) {
        req.session = null;
    }
    res.send({
        success: routerChangePassword
    })
})
*/

userRouter.get("/user-session-data", (req, res) => {
    if (!req.session?.user) {
        return res.status(401).send("You are not logged in!");
    }
    res.json({username: req.session.user.username});
});

userRouter.get("/check-session", (req, res) => {
    res.send({
        success: !!req.session?.user,
    })
})


userRouter.get("/products", async (req, res) => {
    try {
        let productRows = await userController.controllerProductsFetch();
        res.send({
            success: true,
            products: productRows,
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send({
            success: false,
            message: "Server error while fetching products",
        });
    }
});


userRouter.post("/cart-total", async (req, res) => {
    try {
        const cart = req.body.items;
        if (!cart || cart.length === 0) {
            return res.json({ total: 0 });
        }

        const ids = cart.map(i => i.id);
        const [rows] = await db.query(
            "SELECT id, price FROM products WHERE id IN (?)",
            [ids]
        );

        let total = 0;
        for (const item of cart) {
            const dbProduct = rows.find(p => p.id === item.id);
            if (dbProduct) {
                total += dbProduct.price * item.quantity;
            }
        }

        res.json({ total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ total: 0, error: "Failed to calculate total" });
    }
});

userRouter.post("/create-checkout-session", async (req, res) => {
    try {
        const { customer, cart } = req.body;

        if (!req.session.user) {
            return res.status(401).send({ success: false, message: "Unauthorized" });
        }


        if (!cart || cart.length === 0) {
            return res.status(400).send({ success: false, message: "Cart is empty" });
        }

        const productIds = cart.map(item => item.id);
        const [rows] = await db.query(
            "SELECT id, name, price FROM products WHERE id IN (?)",
            [productIds]
        );

        const line_items = cart.map(item => {
            const dbProduct = rows.find(p => p.id === item.id);
            if (!dbProduct) throw new Error(`Product with id ${item.id} not found`);

            return {
                price_data: {
                    currency: "bgn",
                    product_data: {
                        name: dbProduct.name,
                    },
                    unit_amount: Math.round(dbProduct.price * 100),
                },
                quantity: item.quantity,
            };
        });


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,
            success_url: `${process.env.CLIENT_URL}/home?success=true`,
            cancel_url: `${process.env.CLIENT_URL}/cart?canceled=true`,
            metadata: {
                userIde: req.session.user_id.user_id,
                customerName: customer.name,
                customerEmail: customer.email,
                customerAddress: customer.address
            }
        });
        res.send({ url: session.url });
    } catch (err) {
        console.error("Error creating Stripe session:", err);
        res.status(500).send({ success: false, message: "Server error" });
    }
});


userRouter.post("/cart-total", async (req, res) => {
    try {
        const items = req.body.items;
        if (!items || items.length === 0) {
            return res.json({ total: 0, items: [] });
        }

        const productIds = items.map(i => i.id);
        const [rows] = await db.query(
            "SELECT id, name, price FROM products WHERE id IN (?)",
            [productIds]
        );

        let total = 0;
        const detailedItems = items.map(item => {
            const dbItem = rows.find(p => p.id === item.id);
            if (!dbItem) return { ...item, name: item.name, price: 0 };
            total += dbItem.price * item.quantity;
            return { ...item, name: dbItem.name, price: dbItem.price };
        });

        res.json({ total, items: detailedItems });
    } catch (err) {
        console.error("Error calculating cart total:", err);
        res.status(500).json({ total: 0, items: [], error: "Server error" });
    }
});


userRouter.post("/cart-prices", async (req, res) => {
    try {
        const ids = req.body.ids;
        if (!ids || ids.length === 0) {
            return res.json([]);
        }

        const [rows] = await db.query(
            "SELECT id, name, price FROM products WHERE id IN (?)",
            [ids]
        );

        res.json(rows);
    } catch (err) {
        console.error("Error fetching prices:", err);
        res.status(500).json([]);
    }
});


userRouter.post("/update_user_data", async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        const userId = req.session.user_id.user_id;
        const { username, email } = req.body;

        const updates = [];
        const values = [];

        if (username && username.trim() !== "") {
            updates.push("username = ?");
            values.push(username.trim());
        }

        if (email && email.trim() !== "") {
            updates.push("email = ?");
            values.push(email.trim());
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update" });
        }

        values.push(userId);

        const databaseQuery = await userController.controllerUserDataChange(values, updates);
        if(databaseQuery === false) {
            return res.json({ success: true, message: "No user data was updated! "});
        }

        if (username) req.session.user.username = username.trim();

        return res.json({ success: true, message: "User data updated" });
    } catch (err) {
        console.error("Error updating user data:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});
