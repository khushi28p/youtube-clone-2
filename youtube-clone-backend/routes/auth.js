import { User } from "../models/user.js";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

router.post('/signup', async(req, res) => {
    try{
        const {username, email, password} = req.body;
        
        if(!username || !email || !password){
            return res.status(400).json({message: "Please fill all the fields"});
        }

        const existingUsername = await User.findOne({username});

        if(existingUsername){
            return res.status(400).json({message: "Username already taken."});
        }

        const existingEmail = await User.findOne({email});

        if(existingEmail){
            return res.status(400).json({message: "Email already registered."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = User.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User created successfully"
        });

    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;