const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/User"); 
const Product = require("./models/Item")
 
const cors = require('cors'); 
const mongoose = require('mongoose'); 

const bodyParser = require('body-parser');
require('dotenv').config(); 
const jwt = require("jsonwebtoken");

//Execute express 
const app = express(); 

//Middlewares
app.use(express.json()); 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const connectionString = process.env.MONGO_URI; 





mongoose.connect(connectionString)
        .then(() => console.log('Connected to the database…')) 
        .catch((err) => console.error('Connection error:', err));



app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully!Please Login to continue" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});




app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, "yourSecretKey", { expiresIn: "1h" });
        res.json({ message: "Login successful!", token });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
});

app.get("/user/:userId/wishlist", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate("wishlist");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ error: "Error fetching wishlist" });
    }
});

app.post("/items/create", async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const product = new Product({ name, price, category });
        await product.save();

        res.status(201).json({ message: "Product created successfully!", product });
    } catch (error) {
        res.status(500).json({ error: "Error creating product" });
    }
});

app.get("/items", async (req, res) => {
    try {
        const items = await Product.find(); // Get all items from MongoDB
        res.status(200).json({ items });
    } catch (error) {
        res.status(500).json({ error: "Error fetching items" });
    }
});






// Add item to wishlist
app.post("/wishlist/add", async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (!user.wishlist.includes(itemId)) {
            user.wishlist.push(itemId);
            await user.save();
        }

        res.json({ message: "Item added to wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ error: "Error adding item to wishlist" });
    }
});


// Remove item from wishlist
app.post("/wishlist/remove", async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.wishlist = user.wishlist.filter((id) => id.toString() !== itemId);
        await user.save();

        res.json({ message: "Item removed from wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ error: "Error removing item from wishlist" });
    }
});
app.delete("/items/delete/:itemId", async (req, res) => {
    try {
        console.log("Deleting item with ID:", req.params.itemId); // ✅ Debug log
        const { itemId } = req.params;
        const item = await Product.findByIdAndDelete(itemId);

        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json({ message: "Item deleted successfully!" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Error deleting item" });
    }
});





const port = 5000; 

app.listen(port, () => console.log(`Server is running on port ${port}`)); 


