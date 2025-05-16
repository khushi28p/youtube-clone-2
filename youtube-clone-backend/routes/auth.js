import { User } from "../models/user.js";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

router.post('/signup', async(req, res) => {
    try{
        const {channelName, email, password} = req.body;
        
        if(!channelName || !email || !password){
            return res.status(400).json({message: "Please fill all the fields"});
        }

        const existingChannelName = await User.findOne({channelName});

        if(existingChannelName){
            return res.status(400).json({message: "Channel name already taken."});
        }

        const existingEmail = await User.findOne({email});

        if(existingEmail){
            return res.status(400).json({message: "Email already registered."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = User.create({
            channelName,
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