const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt

// Generate JWT
const generateToken = (user, isAdmin = false) => {
    return jwt.sign({ 
        userId: user._id, 
        id: user._id, // Keep both for compatibility
        email: user.email,
        role: user.role, 
        isAdmin: isAdmin 
    }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// Register
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log('Registration request received:', { name, email, role }); // Log request data
        const existing = await User.findOne({ email });
        if (existing) {
            console.log('Email already exists:', email); // Log duplicate email
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully'); // Log password hashing

        const user = await User.create({ name, email, password: hashedPassword, role });
        console.log('User created successfully:', user); // Log user creation
        const token = generateToken(user);

        // Remove password from user object
        const userWithoutPassword = { ...user.toObject() };
        delete userWithoutPassword.password;

        res.status(201).json({ token, user: userWithoutPassword });
    } catch (err) {
        console.error('Registration error:', err); // Log any errors
        res.status(500).json({ error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check for default admin credentials
        let isAdmin = false;
        if (email === 'admin@portal.com' && (await bcrypt.compare(password, '$2a$10$your_hashed_default_password'))) { // Replace with hashed password
            isAdmin = true;
        }

        const token = generateToken(user, isAdmin);
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create Admin
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user with the admin role
        const user = await User.create({ name, email, password: hashedPassword, role: 'admin' });

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (err) {
        console.error('Admin creation error:', err);
        res.status(500).json({ error: err.message });
    }
};
