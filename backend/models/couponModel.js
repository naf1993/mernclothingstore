import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,
  },
  discount:{
    type:Number,
    required:true
  },
  isActive:{
    type:Boolean,
    default:true
  },createdAt:{
    type:Date,
    default:Date.now
  },
  expiresAt:{
    type:Date,
  }
  
});
couponSchema.pre('save',function(next){
  if(!this.expiresAt){
    this.expiresAt = new Date(this.createdAt)
    this.expiresAt.setDate(this.expiresAt.getDate()+15)
  }
  next()
})
couponSchema.methods.checkExpiration = function(){
  const now = new Date()
  if(now > this.expiresAt){
    this.isActive = false
  }
}

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
