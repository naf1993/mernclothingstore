import mongoose from "mongoose";
import slugify from "slugify";



const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter category"],
      trim: true,
      unique:true,
      maxlength: [
        40,
        "Category name must have less or equal then 40 characters",
      ],
      minlength: [
        3,
        "Category name must have more or equal then 3 characters",
      ],
      //validate: [validator.isAlpha, "Product name must not contain numbers"],
    },
    categoryImage: {
      type: String,
     
    },
    
    slug: String,

   
  },
  
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

categorySchema.virtual('subcategories',{
  ref:'SubCategory',
  foreignField:'Category',
  localField:'_id'
})
categorySchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true})
    next()
})



const Category = mongoose.model("Category", categorySchema);

export default Category;
