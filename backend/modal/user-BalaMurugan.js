import mongoose from 'mongoose';
const { Schema } = mongoose;


// Define the Customer schema
const userSchema = new Schema({
   
    userName: {
        type: String,
        // required: true,
        default: "",
    },
   
    age: {
        type: Number,
        // required: true,
        default: null,
    },
    password: {
        type: String,
        // required: true,
        default: "",
    },
    referralCode:{
        type: String,
        // required: true,
        default: null,
    },
    referredBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        default: null 
    },
    wallet: {
      type: Number,
      default: 0
    }
  
}, {
    timestamps: true,  // Adds createdAt and updatedAt fields automatically
});

//MIDDLE-WARE-FUNCTION


// Compile the schema into a model
const User = mongoose.model('Users', userSchema);

export default User