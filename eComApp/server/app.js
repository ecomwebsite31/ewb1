// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const morgan = require('morgan');
const sendEmail = require('./mailsender');

const app = express();
const PORT = 3000;

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
require('./db');
// Define User Schema and Model
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Define Product Schema and Model
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    // Add other fields as needed
});

const Product = mongoose.model('Product', productSchema);

// Define Cart Schema and Model
const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
});

const cartSchema = new mongoose.Schema({
    items: [cartItemSchema],
});

const Cart = mongoose.model('Cart', cartSchema);

// Define Order Schema and Model
const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [orderItemSchema],
});

const Order = mongoose.model('Order', orderSchema);
// OTP Model

const otpSchema = new mongoose.Schema({
    username: String,
    otp: String,
    key: String
});

const OTP = mongoose.model('OTP', otpSchema);

// Registration Module
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists. Choose another username.' });
        }

        // Create a new user
        const newUser = new User({ username, password });
        await newUser.save();

        res.json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login Module
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Check if the password is correct
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        res.json({ message: 'Login successful.' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/forgot-password', async (req, res) => {
    const { username } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Generate a random OTP (4 digits)
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const key = Math.floor(1000 + Math.random() * 90000000).toString();

        // Save the OTP in the database for future validation
        const otpData = new OTP({ username, otp, key });
        await otpData.save();

        // Send the OTP to the user's email
        const emailResponse = await sendEmail(username, 'Password Reset OTP', `Your OTP is: ${otp}`);
        console.log('Email response:', emailResponse);

        // Include a unique identifier (token) in the response
        const token = otpData.key;

        res.json({ message: 'Password reset instructions sent to your email.', token, otp });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/change-password', async (req, res) => {
    const { token, newPassword, username } = req.body;

    try {
        // Find the OTP data based on the token
        const otpData = await OTP.findOne({ key: token });

        if (!otpData) {
            return res.status(401).json({ message: 'Invalid token. Please request OTP again.' });
        }

        // Find the user based on the username from OTP data
        const user = await User.findOne({ username: otpData.username });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        // Remove the used OTP data
        await otpData.deleteOne({ key: otpData.key });

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Error during password change after OTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Add an endpoint for validating OTP during login
app.post('/login-otp', async (req, res) => {
    try {
        const { username, otp } = req.body;

        // Fetch the stored OTP from the database based on the username
        const storedOTP = await OTP.findOne({ username });

        if (!storedOTP || storedOTP.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        // OTP is valid, proceed with authentication and login

        res.status(200).json({ message: 'OTP validated successfully' });
    } catch (error) {
        console.error('Error validating OTP during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Product Catalog Module
// Assuming this is inside your Express app setup
app.get('/products', async (req, res) => {
    try {
        // Read data from data.json synchronously
        const dataPath = path.join(__dirname, 'data.json');
        const jsonData = fs.readFileSync(dataPath, 'utf8');
        const products = JSON.parse(jsonData).products;

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching product catalog:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Add to Cart Module
app.post('/add-to-cart', async (req, res) => {
    const { username, productId, quantity } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Add the product to the user's cart
        user.cart.push({ product: productId, quantity });
        await user.save();

        res.json({ message: 'Product added to cart successfully.' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Checkout and Payment Module
app.post('/checkout', async (req, res) => {
    const { username, cartItem, paymentOption, address } = req.body;

    try {


        // Check if the user has items in the cart
        if (cartItem.length === 0) {
            return res.status(400).json({ message: 'Cart is empty. Add items before checkout.' });
        }

        // Create an order based on the items in the cart
        const order = new Order({
            user: '65b92ab8ab1525e8c6ecfccd',
            items: cartItem.map(cartItem => ({ product: cartItem.product, quantity: cartItem.quantity })),
        });

        // Send order details to mail
        sendEmail(username, 'Order Details', `Order Details: ${JSON.stringify({ cartItem, paymentOption, address })}`);

        // Clear the user's cart after creating the order
        await Promise.all([order.save()]);

        res.json({ message: 'Checkout successful. Order placed. Thanks for using my App' });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
