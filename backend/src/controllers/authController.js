const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Register User
const register = async (req,res)=>{
    try{
        const {name,email,password,role}=req.body;

        if(!name||!email||!password||!role){
            return res.status(400).json({
                message:"All fields are required"
            });
        }

        if (!["student","faculty"].includes(role)){
            return res.status(400).json({
                message:"Role must be student or faculty"
            });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                message:"User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role
        });

        res.status(201).json({
            message:"User registered successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
    }
    catch(error){
        res.status(500).json({
            message:"Registration Failed",
            error:error.message
        })
    }
};

//Login User
const login = async(req,res)=>{
    try{
        const {email,password}= req.body;
        if(!email||!password){
            return res.status(400).json({
                message:"Email and password are required"
            });
        }
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );
        if(!passwordMatch){
            return res.status(401).json({
                message:"Invalid email or passworrd"
            });
        }

        const token = jwt.sign(
            {
                id:user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );
        
        res.status(200).json({
            message:"Login successfully",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })
    }catch(error){
        res.status(500).json({
            message:"Login Failed",
            error:error.message
        });
    }
};

const createAdmin = async(req,res)=>{
    try{
        const setupSecret = req.headers["x-admin-setup-secret"]
        if(!setupSecret || setupSecret !== process.env.ADMIN_SETUP_SECRET){
            return res.status(403).json({
                message:"Invalid admin setup authroization"
            });
        }
        const {name,email,password} = req.body;
        if(!name||!email||!password){
            return res.status(400).json({
                message:"Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                message:"User with this email already exists"
            });
        }
        const hashpassword = await bcrypt.hash(password,10);
        const admin = await User.create({
            name,
            email,
            password:hashpassword,
            role:"admin"
        });

        res.status(201).json({
            message:"Admin created successfully",
            admin:{
                id:admin._id,
                name:admin.name,
                email:admin.email,
                role:admin.role
            }
        });
    }catch(error){
        res.status(500).json({
            message:"Admin creation failed",
            error:error.message
        });
    }
}

module.exports = {
    register,
    login,
    createAdmin
};