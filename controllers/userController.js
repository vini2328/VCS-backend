import UserModel from "../models/user.js";
import bcrypt from 'bcrypt';
import  jwt  from "jsonwebtoken";

class UserController{
    static userRegistration = async(req,res)=>{
        const {name, email, password, password_confirmation, tc}=req.body
        const user= await UserModel.findOne({email:email})
        if(user){
            res.send({"status":"failed", "message":"Email already exsist"})


        }else{
            if (name && email && password && password_confirmation && tc){
             if(password === password_confirmation){
                try {
                    const salt=await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password,salt)
                    const doc=new UserModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                        tc:tc
                    })
                    await doc.save()
                    const saved_user= await UserModel.findOne({email:email})
                    // generate JWT Token
                    const token = jwt.sign({userID :saved_user._id},
                    process.env.JWT_SECRET_KEY, { expiresIn: '5d'})
                    res.status(201).send({"status":"Success", "message":
                    "Registration Successfully","token":token})

    
       
                } catch (error) {
                    console.log(error)
                    res.send({"status":"failed", "message":"Unable to rgister"})

                    
                }
             }else{
                res.send({"status":"failed", "message":"Password doesnt match"})
             }
            }else{
                res.send({"status":"failed", "message":"All fields are required"})
            }
        }
    
    
    
    }
    static userLogin =async(req,res)=>{
        try {
          const {email,password} =req.body 
          if(email && password){
            const user= await UserModel.findOne({email:email})
           if(user !=null){
            const isMatch = await bcrypt.compare(password,user.password)
            if((user.email === email ) && isMatch){
                // generate jwt token
                const token = jwt.sign({userID :user._id},
                    process.env.JWT_SECRET_KEY, { expiresIn: '5d'})

                res.send({"status":"success", "message":"Login success","token":token})

            }else{
                res.send({"status":"failed", "message":"email and password doesnt match"})
 
            }

           }else{
            res.send({"status":"failed", "message":"you are not a regsitered user"})
           }
          }else{
            res.send({"status":"failed", "message":"All fields are required"})
        }
        } catch (error) {
            console.log(error)
            res.send({"status":"failed", "message":"Unable to Login"})

        }
    }

    static changeUserPassword = async(req,res)=>{
        const {password,password_confirmation}=req.body
        if(password && password_confirmation){
            if( password !== password_confirmation){
                res.send({"status":"failed", "message":"new paswrd and confirm new password  doesnt match"})

            }else{
                const salt= await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password,salt)
                await UserModel.findByIdAndUpdate(req.user._id, {$set: {password:newHashPassword}})
                res.send({"status":"success", "message":"password changed succesfully"})


            }       

        }else{
            res.send({"status":"failed", "message":"All fields are required"})
  
        }
    }

    static loggedUser = async (req , res)=>{
       res.send({"user": req.user})
    }

    static sendUserpasswordResetEmail= async (req,res)=>{
        const {email}= req.body
        if(email){
            const user= await UserModel.findOne({email:email})
            if(user){

            const secret =user._id + process.env.JWT_SECRET_KEY
            const token = jwt.sign({userID :user._id},
                secret, { expiresIn: '15m'})
                const link =`http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`

                console.log(link)
                res.send({"status":"success", "message":"Password Reset email sent ...please check your email"})




        }else{
            res.send({"status":"failed", "message":"Email doesnt exsist"})

        }
        }else{
            res.send({"status":"failed", "message":"Email fields are required"})
 
        }
    }
 
}
export default UserController