const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');


const JWT_SECRET = 'asoiducan93284c9rew';
const blacklist = [];

async function register(email, username, password, firstName, lastName) {
    const existingEmail = await User.findOne({ email: new RegExp(`^${email}$`, 'i')});
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
        throw new Error('Email already exists');
    } else if (existingUsername) {
        throw new Error('Username already exists');
    }

    const user = new User({
        email,
        username,
        password: await bcrypt.hash(password, 10),
        firstName,
        lastName
    });

    await user.save();

    return createSession(user);
}

async function login(email, password) {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (!user) {
        throw new Error('Incorrect email or password');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error('Incorrect email or password');
    }

    return createSession(user);
}

function logout(token) {
    blacklist.push(token);
}

function createSession(user) {
    return {
        email: user.email,
        _id: user._id,
        accessToken: jwt.sign({
            email: user.email,
            _id: user._id
        }, JWT_SECRET)
    };
}

function verifySession(token) {
    if (blacklist.includes(token)) {
        throw new Error('Token is invalidated');
    }
    
    const payload = jwt.verify(token, JWT_SECRET);
    
    return {
        email: payload.email,
        _id: payload._id,
        token
    };
}

module.exports = {
    register,
    login,
    logout,
    verifySession
};
