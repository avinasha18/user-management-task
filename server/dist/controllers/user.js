var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Get, Post, Put, Delete, Middleware } from '@overnightjs/core';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
let UserController = class UserController {
    async register(req, res) {
        const { username, password, email, address } = req.body;
        try {
            console.log('in register');
            const newUser = new User({ username, password, email, address });
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
        }
        catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ error: 'Error registering user' });
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body;
            console.log('Login request:', { username, password });
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
            res.status(200).json({ token, userId: user._id });
        }
        catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Error logging in' });
        }
    }
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching profile' });
        }
    }
    async updateProfile(req, res) {
        const { username, email, address } = req.body;
        try {
            const user = await User.findByIdAndUpdate(req.userId, { username, email, address }, { new: true });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ error: 'Error updating profile' });
        }
    }
    async deleteProfile(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.userId);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json({ message: 'User deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error deleting profile' });
        }
    }
    async getAllUsers(_req, res) {
        try {
            const users = await User.find({}, '-password');
            res.status(200).json(users);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching users' });
        }
    }
};
__decorate([
    Post('register'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    Post('login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    Get('profile'),
    Middleware(authMiddleware),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    Put('profile'),
    Middleware(authMiddleware),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    Delete('profile'),
    Middleware(authMiddleware),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteProfile", null);
__decorate([
    Get('users'),
    Middleware(authMiddleware),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
UserController = __decorate([
    Controller('api/users')
], UserController);
export default UserController;
