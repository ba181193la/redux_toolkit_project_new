const mongoose = require('mongoose');

const referralHistorySchema = new mongoose.Schema({
  userId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
     }, // Who triggered the chain
  referredBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users' 
},
  level: {type: Number,default: 0}, // Level of referral
  commissionAmount: {type: Number,default: 0},
  date: { type: Date, default: Date.now }
},{timestamps: true}
);

const ReferralHistory = mongoose.model('referralHistory', referralHistorySchema);

export default ReferralHistory;
