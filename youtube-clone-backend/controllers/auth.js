import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async(req, res) => {
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

        await newUser.save();

        res.status(201).json({
            message: "User created successfully"
        });

    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
};

export const login = async(req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Please fill all the fields"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid password"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        console.log(token);

        res.status(200).json({
            message: "Login successful",
            token
        })
    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
};