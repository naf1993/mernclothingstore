import mongoose from "mongoose";

import validator from "validator";
import Product from "./productModel.js";

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

 reviewSchema.index({product:1,user:1},{unique:true})


reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(productId){
    const stats = await this.aggregate([
        {
            $match:{product:productId}
        },
        {
            $group:{
                _id:'$product',
                nRating:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
    ])
    if(stats.length>0){
        await Product.findByIdAndUpdate(productId,{
            ratingsQuantity:stats[0].nRating,
            ratingsAverage:stats[0].avgRating
        })
    }
    else{
        await Product.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 3
          });
    }
}

reviewSchema.post('save', function() {
    // this points to current review
    this.constructor.calcAverageRatings(this.product);
  });
  
  // findByIdAndUpdate
  // findByIdAndDelete
  // reviewSchema.pre(/^findOneAnd/, async function(next) {
  //   this.r = await this.findOne();
  //   // console.log(this.r);
  //   next();
  // });
  
  // reviewSchema.post(/^findOneAnd/, async function() {
  //   // await this.findOne(); does NOT work here, query has already executed
  //   await this.r.constructor.calcAverageRatings(this.r.product);
  // });



const Review = mongoose.model("Review", reviewSchema);

export default Review;
