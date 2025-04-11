const mongoose = require('mongoose');
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
   
}, {
    timestamps: true,  // Adds createdAt and updatedAt fields automatically
});

//MIDDLE-WARE-FUNCTION


// Compile the schema into a model
const user = mongoose.model('users', userSchema);

module.exports = user;