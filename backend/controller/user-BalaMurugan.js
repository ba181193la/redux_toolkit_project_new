import mongoose from 'mongoose';
import {User,ReferralHistory} from '../modal/index';
import {generateReferralCode} from '../helper/helper'
const { ObjectId } = mongoose.Schema.Types;

//npm i @babel/cli @babel/core @babel/node @babel/preset-env --save-dev
export const createUser=async(req,res)=>{
    try {
        let reqBody=req.body
        const userData=new User({
            userName:reqBody.userName,
            age:reqBody.age,
            password:reqBody.password,
            referralCode: generateReferralCode(),
        })
        await userData.save()
      
          // Distribute commission
          if (reqBody.referralCode) {
            console.log("****************enter referal code", reqBody.referralCode);
            const referrer = await User.findOne({ referralCode: reqBody.referralCode });
            if (referrer) { 
                userData.referredBy = referrer._id; // Set the referrer ID
                await userData.save(); // Save the user with the referrer ID
                await distributeCommission(userData?._id, 100); // Let's say 100 is the signup bonus
                }
          }
       return res.status(200).json({message:"created successfully", userData})
    } catch (error) {
        console.log("error", error);
       return res.status(500).json({message:"server error", error})
    }
}

export const fetchUser=async(req,res)=>{
    try {        
        const userData=await User.find({})
       return res.status(200).json({message:"user fetched successfully", userData})
    } catch (error) {
      return  res.status(500).json({message:"server error", error})
    }
}

export const getUserDetails=async(req,res)=>{
    try {
        const userData=await User.findOne({_id:new ObjectId(req.params.id)})
        res.status(200).json({message:"user fetched successfully", userData})
    } catch (error) {
        res.status(500).json({message:"server error", error})
    }
}

export const updateUser=async(req,res)=>{
    try {
        let reqBody=req.body
        console.log(reqBody);
        
        let updateObject={
            userName:reqBody.userName,
            age:reqBody.age,
        }
        const userData=await User.updateOne(
            {_id:new ObjectId(req.params.id)},
            {$set:updateObject}
    )
        res.status(200).json({message:"user updated successfully", userData})
    } catch (error) {
        console.log("error", error);
        
        res.status(500).json({message:"server error", error})
    }
}

export const deleteUser=async(req,res)=>{
    try {
        const userData=await User.deleteOne({_id:new ObjectId(req.params.id)})
        res.status(200).json({message:"user deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"server error", error})
    }
}

const COMMISSION_RATES = {
    1: 0.10,
    2: 0.05,
    3: 0.03,
    4: 0.02
  };
const distributeCommission = async(userId, totalCommission) =>{
    console.log("***************distribute commission", userId, totalCommission);
    
    const commissions = [];
    let currentUser = await User.findById({_id:userId}).populate('referredBy');
    let level = 1;
  
    while (currentUser?.referredBy && level <= 4) {
      const referrer = currentUser.referredBy;
      console.log("***************referrer", referrer);
      
      const rate = COMMISSION_RATES[level] || 0;
      const amount = parseFloat((totalCommission * rate).toFixed(2));
  
      if (amount > 0) {
        // 1. Update wallet
        await User.findByIdAndUpdate(referrer._id, {
          $inc: { wallet: amount }
        });
  
        // 2. Save referral history
        await ReferralHistory.create({
          userId: userId,
          referredBy: referrer._id,
          level,
          commissionAmount: amount
        });
  
        // 3. Push to return array
        commissions.push({
          userId: referrer._id,
          name: referrer.name,
          level,
          amount
        });
      }
  
      currentUser = await User.findById(referrer._id).populate('referredBy');
      level++;
    }
  
    return commissions;
  }
  
//   async function distributeCommission(referralCode, amount) {
//     const levels = [0.1, 0.05, 0.02]; // 10%, 5%, 2%
//     let currentCode = referralCode;
  
//     for (let i = 0; i < levels.length; i++) {
//       const refUser = await User.findOne({ referralCode: currentCode });
//       if (!refUser) break;
  
//       const commission = amount * levels[i];
//       refUser.wallet += commission;
//       await refUser.save();
  
//       currentCode = refUser.referredBy;
//     }
//   }