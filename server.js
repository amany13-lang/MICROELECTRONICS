const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json()); 

mongoose.connect("mongodb://127.0.0.1:27017/microelectronics")
    .then(() => console.log("mongoDB Connected"))
    .catch((err) => console.log(err));

const User = require("./user");

// ======= Register =======
app.post("/register", async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ msg: "Request body is missing" });

        const { username, email, password, role } = req.body;

        
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "Account already exists" });

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashPassword,
            role
        });

        res.status(201).json({
            msg: "User created successfully",
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});

// ======= Login =======
app.post("/login", async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ msg: "Request body is missing" });

        const { email, password } = req.body;

        if (!email) return res.status(400).json({ msg: "email is required" });
        if (!password) return res.status(400).json({ msg: "password is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        res.status(200).json({
            msg: "Login successful",
            data: {
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
}, { timestamps: true });
const isAdmin = (req, res, next) => {
    if (req.body.role !== "admin") {
        return res.status(403).json({ msg: "Access denied" });
    }
    next();
}
app.post("/products", async (req, res) => {
    try {
        const { name, price, quantity } = req.body;

        if (!name || !price || !quantity)
            return res.status(400).json({ msg: "Missing data" });

        const product = await Product.create({ name, price, quantity });
        res.status(201).json(product);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

const Product = mongoose.model("Product", productSchema);
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

