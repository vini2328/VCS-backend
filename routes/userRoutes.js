import express from "express";
const router= express.Router();
import UserController from "../controllers/userController.js";

// route level middleware - To protect  Route


// public routes
router.post('/register',UserController.userRegistration)
router.post('/login',UserController.userLogin)


// protected routes




export default router; 