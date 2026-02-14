const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/microelectronics")
 .then(()=>console.log("mongoDB Connected"))
.catch((err)=>console.log(err));

const OrderSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true }
});
app.post("/api/orders", async (req, res) => {
    try {
        const { clientName, productName, quantity } = req.body;
        const newOrder = new Order({ clientName, productName, quantity });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

