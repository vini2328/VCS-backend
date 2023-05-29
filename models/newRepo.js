import mongoose from "mongoose";

// Repo Schema

const RepoSchema= new mongoose.Schema({

    repositaryName:{type:String, required:true,trim:true},
    code:{type:String, required:true},
    commit_msg:{type:String, required:true,trim:true},
    ownedby:{type:String, required:true,trim:true}


})

const RepoModel =mongoose.model("repo",RepoSchema)

export default RepoModel;
