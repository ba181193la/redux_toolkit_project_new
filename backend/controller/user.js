const { ObjectId } = require('bson');
const User=require('../mondal/user')

exports.createUser=async(req,res)=>{
    try {
        console.log("***************",req.body);
        let reqBody=req.body
        const userData=new User({
            userName:reqBody.userName,
            age:reqBody.age,
            password:reqBody.password
        })
        await userData.save()
        res.status(200).json({message:"user created successfully", userData})
    } catch (error) {
        res.status(500).json({message:"server error", error})
    }
}

exports.fetchUser=async(req,res)=>{
    try {
        const userData=await User.find({})
        res.status(200).json({message:"user fetched successfully", userData})
    } catch (error) {
        res.status(500).json({message:"server error", error})
    }
}

exports.getUserDetails=async(req,res)=>{
    try {
        const userData=await User.findOne({_id:new ObjectId(req.params.id)})
        res.status(200).json({message:"user fetched successfully", userData})
    } catch (error) {
        res.status(500).json({message:"server error", error})
    }
}

exports.updateUser=async(req,res)=>{
    try {
        let reqBody=req.body
        let updateObject={
            userName:reqBody.userName,
            age:reqBody.age,
            password:reqBody.password
        }
        const userData=await User.updateOne(
            {_id:new ObjectId(req.params.id)},
            {$set:updateObject}
    )
        res.status(200).json({message:"user updated successfully", userData})
    } catch (error) {
        res.status(500).json({message:"server error", error})
    }
}

exports.deleteUser=async(req,res)=>{
    try {
        const userData=await User.deleteOne({_id:new ObjectId(req.params.id)})
        res.status(200).json({message:"user deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"server error", error})
    }
}