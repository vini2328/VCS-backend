import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ status: "failed", message: "Email already exsist" });
    } else {
      if (name && email && password && password_confirmation && tc) {
        if (password === password_confirmation) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc,
            });
            await doc.save();
            const saved_user = await UserModel.findOne({ email: email });
            // generate JWT Token
            const token = jwt.sign(
              { userID: saved_user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res
              .status(201)
              .send({
                status: "Success",
                message: "Registration Successfully",
                token: token,
              });
          } catch (error) {
            console.log(error);
            res.send({
              status: "failed",
              message: "Unable to rgister",
              error: error,
            });
          }
        } else {
          res.send({ status: "failed", message: "Password doesnt match" });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    }
  };
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            // generate jwt token
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );

            res.send({
              status: "success",
              message: "Login success",
              token: token,
            });
          } else {
            res.send({
              status: "failed",
              message: "email and password doesnt match",
            });
          }
        } else {
          res.send({
            status: "failed",
            message: "you are not a regsitered user",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Unable to Login" });
    }
  };

  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({
          status: "failed",
          message: "new paswrd and confirm new password  doesnt match",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await UserModel.findByIdAndUpdate(req.user._id, {
          $set: { password: newHashPassword },
        });
        res.send({
          status: "success",
          message: "password changed succesfully",
        });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  };

  static loggedUser = async (req, res) => {
    res.send({ user: req.user });
  };

  static sendUserpasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    try {
      if (email) {
        const user = await UserModel.findOne({ email: email });
        if (user) {
          const secret = user._id + process.env.JWT_SECRET_KEY;

          const token = jwt.sign({ userID: user._id }, secret, {
            expiresIn: "15m",
          });
          const link = `http://localhost:3000/confirmpassword/${user._id}/${token}`;
          console.log(link);

          // send email
          let testAccount = await nodemailer.createTestAccount();

          let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
          let info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "VCS password reset link",
            html: `<a href=${link}>Click Here</a> to reset your password`,
          });

          console.log("infppp", info);
          res.send({
            status: "success",
            message: "password reset email sent...please check your email",
            info: nodemailer.getTestMessageUrl(info),
          });
        } else {
          res.send({ status: "failed", message: "Email dosent exsist" });
        }
      } else {
        res.send({ status: "failed", message: "all fields are required" });
      }
    } catch (error) {
      console.log("erorr", error);
      res.send("err", error);
    }
  };
  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await UserModel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY;

    console.log("idddd", id, "tokennn", token);

    try {
      jwt.verify(token, new_secret);
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({
            status: "failed",
            message: "New password and confirm password doesnt match",
          });
        } else {
          const salt = await bcrypt.genSalt(12);
          const newhashpassword = await bcrypt.hash(password, salt);
          await UserModel.findByIdAndUpdate(user._id, {
            $set: { password: newhashpassword },
          });
          res.send({
            status: "Success",
            message: "password reset succesfully",
          });
        }
      } else {
        res.send({ status: "failed", message: "all fields are required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "all fields are required" });
    }
  };
}
export default UserController;
