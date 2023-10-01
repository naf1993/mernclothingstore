import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
 counter:{
    type:Number,
    required:true
 }
});

const Visit = mongoose.model("Visit", visitorSchema);

export default Visit;
