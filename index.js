import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import userRouter from "./routers/userRouter.js"
import jwt from "jsonwebtoken"
import productRouter from "./routers/productRouter.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()


app.use(bodyParser.json())

app.use(
    (req,res,next)=>{
        const value = req.header("Authorization")
        if(value != null){
            const token = value.replace("Bearer ","")
            jwt.verify(
                token,
                "supersecretkey123",
                (err,decoded)=>{
                    if(decoded == null){
                        res.status(403).json({
                            message : "Unauthorized"
                        })
                    }else{
                        req.user = decoded
                        next()
                    }                    
                }
            )
        }else{
            next()
        }        
    }
)


const connectionString = "mongodb://127.0.0.1:27017/cosmeticsdb";



mongoose.connect("mongodb://127.0.0.1:27017/cosmeticsdb")
  .then(() => {
    console.log("✅ Connected to database");
  })
  .catch((err) => {
    console.log("❌ Failed to connect to the database:", err.message);
  });






app.use("/api/users", userRouter)
app.use("/api/products",productRouter)



app.listen(5000, 
   ()=>{
       console.log("server started")
   }
)
