import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export function createUser(req,res){

    const passwordHash = bcrypt.hashSync(req.body.password,10)
    


    const userData = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : passwordHash,
    }

    const user = new User(userData)

    user.save().then(
        ()=>{
            res.json({
                message : "User created successfully"
            })
        }
    ).catch(
        ()=>{
            res.json({
                message : "Failed to create user"
            })
        }
    )
}

export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Plain password:", password);
    console.log("Hashed password:", user.password);

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    console.log("Password match:", isPasswordCorrect);

    if (isPasswordCorrect) {
      const token = jwt.sign(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isBlocked: user.isBlocked,
          isEmailVerified: user.isEmailVerified,
          image: user.image,
        },
        process.env.JWT_SECRET
      );

      return res.json({
        token: token,
        message: "Login successful",
        role: user.role,
      });
    } else {
      return res.status(403).json({ message: "Incorrect password" });
    }
  }).catch((err) => {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  });
}


export function isAdmin(req){
    
    if(req.user == null){
        return false;
    }

    if(req.user.role == "admin"){
        return true;
    }else{
        return false;
    }
}