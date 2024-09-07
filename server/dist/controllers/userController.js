var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Controller, Get, Post, Put, Delete, Middleware } from '@overnightjs/core';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config';
import { authMiddleware } from '../middlewares/authMiddleware';
let UserController = class UserController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password, email, address } = req.body;
            try {
                console.log('in register');
                const newUser = new User({ username, password, email, address });
                yield newUser.save();
                res.status(201).json({ message: 'User registered successfully' });
            }
            catch (error) {
                console.error('Error registering user:', error);
                res.status(500).json({ error: 'Error registering user' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                console.log('Login request:', { username, password });
                if (!username || !password) {
                    return res.status(400).json({ error: 'Username and password are required' });
                }
                const user = yield User.findOne({ username });
                if (!user) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
                const isMatch = yield user.comparePassword(password);
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
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User.findById(req.userId);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(200).json(user);
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching profile' });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, address } = req.body;
            try {
                const user = yield User.findByIdAndUpdate(req.userId, { username, email, address }, { new: true });
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(200).json(user);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating profile' });
            }
        });
    }
    deleteProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User.findByIdAndDelete(req.userId);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(200).json({ message: 'User deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting profile' });
            }
        });
    }
    getAllUsers(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User.find({}, '-password');
                res.status(200).json(users);
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching users' });
            }
        });
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
export { UserController };
