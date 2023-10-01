import mongoose from "mongoose";
import slugify from "slugify";



const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter sub category"],
      trim: true,
      unique:true,
      maxlength: [
        40,
        "Sub Category name must have less or equal then 40 characters",
      ],
      minlength: [
        3,
        "Sub Category name must have more or equal then 3 characters",
      ],
      //validate: [validator.isAlpha, "Product name must not contain numbers"],
    },
    slug: String,
    Category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    }

   
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

subCategorySchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true})
    next()
})



const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;
