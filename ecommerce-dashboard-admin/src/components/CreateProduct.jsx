import React, { useState, useEffect, useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Typography,
  useTheme,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import CustomInput from "./ui/CustomInput";
import CustomSelect from "./ui/CustomSelect";
import ColorButton from "./ui/ColorButton";
import axios from "axios";
import { HiXMark } from "react-icons/hi2";
import CustomModal from "./CustomModal";
import useOutsideClick from "hooks/useOutsideClick";
import CustomCheckbox from "./ui/CustomCheckbox";
import CustomFileInput from "./ui/CustomFileInput";
import CloseButton from "./ui/CloseButton";
import { colorsArray, sizesOptions } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../actions/productActions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateProduct = ({product = {},onCloseModal}) => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [categoryError, setCategoryError] = useState("");
  const [subcategoryError, setSubcategoryError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [objectUrls, setObjectUrls] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productCreate = useSelector((state) => state.productCreate);
  const { loading, success, error } = productCreate || {};
useEffect(()=>{
if(product){
  console.log(product)
}
},[product])
 
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    sizes: [],
  });
  const selectedColors = watch("colors") || [];
  const images = watch("images");

  const colorsObjectsArray = useMemo(
    () => colorsArray.map((color) => ({ label: color, value: color })),
    []
  );

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setValue("images", files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
    setObjectUrls((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i != index);
    const updatedUrls = objectUrls.filter((_, i) => i != index);
    URL.revokeObjectURL(objectUrls[index]);
    setImagePreviews(updatedPreviews);
    setObjectUrls(updatedUrls);
  };
  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/categories"
        );
        const options = data.data.categories.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        setCategories(options);

        // Clear any previous error
      } catch (error) {
        toast.error("Failed to load categories. Please try again later.");
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      async function fetchSubCategories() {
        try {
          const { data } = await axios.get(
            `http://localhost:5000/api/categories/${selectedCategory}`
          );
          const options = data.data.category.subcategories.map(
            (subcategory) => ({
              value: subcategory.id,
              label: subcategory.name,
            })
          );
          setSubCategories(options);
        } catch (error) {
          toast.error("Failed to load subcategories. Please try again later.");
        }
      }

      fetchSubCategories();
    } else {
      setSubCategories([]); // Reset subcategories if no category is selected
      setSubcategoryError(""); // Clear error if category is reset
    }
  }, [selectedCategory]);

  const onSubmit = async (data) => {
    console.log(data)
   
    const formData = new FormData();

    // Append text fields
    for (const key in data) {
      if (Array.isArray(data[key])) {
        data[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, data[key]);
      }
    }

    // Append images
    // images.forEach((image) => {
    //   formData.append("images", image);
    // });
    // const flatColors = selectedColors.flat();
    // flatColors.forEach((color) => {
    //   formData.append("colors", color);
    // });
    // console.log('flat colors ',flatColors)
    // console.log(formData);
    try {
      // Make API request with formData
      await dispatch(createProduct(formData));
      if(success){
        toast.success("Product created successfully!");
        reset();
        // Delay navigation for better UX
        setTimeout(() => {
          navigate("/products/grid");
        }, 2000); 
      }
      if(error){
        toast.error(error)

      }
     // Delay for 2 seconds
    } catch (err) {
      toast.error("Error creating product:", err);
    }
  };
  const clearColors = () => {
    setValue("colors", []); // Clear the colors array
  };
  const removeColor = (color) => {
    const updatedColors = selectedColors.filter((col) => col != color);
    setValue("colors", updatedColors);
  };

  useOutsideClick(modalRef, () => setIsOpenModal(false));
 

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6}>
          <CustomInput
            type="text"
            label="Product Name"
            {...register("name", { required: "Product name is required" })}
            error={errors.name?.message}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          <CustomInput
            type="text"
            label="Product Brand"
            {...register("brand", { required: "Brand name is required" })}
            error={errors.brand?.message}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6">Feedback Form</Typography>

          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                multiline
                rows={3}
                variant="outlined"
                error={Boolean(errors.description)}
                helperText={
                  errors.description ? errors.description.message : ""
                }
                fullWidth
                sx={{ marginBottom: 2 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          {" "}
          <CustomInput
            type="number"
            label="Product Stock"
            {...register("countInStock", {
              required: "Stock count is required",
            })}
            error={errors.countInStock?.message}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          {" "}
          <CustomInput
            type="number"
            label="Price"
            {...register("price", { required: "Price is required" })}
            error={errors.price?.message}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          {categories.length > 0 && (
            <CustomSelect
              label="Category"
              options={categories}
              value={selectedCategory || ""}
              {...register("Category", { required: "Category is required" })}
              error={errors.Category?.message}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCategory(value); // Update local state
                setValue("Category", value); // Update react-hook-form state
                setSelectedSubcategory(""); // Reset subcategory when category changes
              }}
            />
          )}
        </Grid>
        <Grid item xs={6} sm={6}>
          {categories.length > 0 && (
            <CustomSelect
              label="Choose SubCategory"
              options={subcategories} // Ensure this is populated
              value={selectedSubcategory || ""}
              {...register("SubCategory", {
                required: "SubCategory is required",
              })}
              error={errors.SubCategory?.message}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedSubcategory(value); // Update local state
                setValue("SubCategory", value); // Update react-hook-form state
              }}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              display: "flex",
              // Align items at the start

              flexDirection: "column",
              padding: ".4rem", // Add padding for better spacing
              backgroundColor: theme.palette.background.paper, // Optional: set a background
              borderRadius: "4px", // Optional: rounded corners
              // Optional: shadow for depth
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "14px", // Slightly larger font size for visibility
                color: theme.palette.primary.textcolor, // Change color for emphasis
                fontWeight: 400, // Medium weight for better readability
              }}
            >
              Select Size
            </Typography>
            <Box
              sx={{
                display: "flex",
                // Allow checkboxes to wrap
                gap: "0.3rem", // Add spacing between checkboxes
              }}
            >
              {sizesOptions.map((option) => (
                <CustomCheckbox
                  key={option.value}
                  control={control}
                  name="sizes"
                  value={option.value}
                  label={option.label}
                  sx={{ margin: 0 }} // Remove default margin for better alignment
                />
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            onClick={() => setIsOpenModal((show) => !show)}
            size="small"
            sx={{
              width: "100%",
              backgroundColor: "white",
              border: `1.9px solid rgba(0, 0, 0, 0.12)`,
              color: theme.palette.primary.textcolor,
              padding: ".8rem .8rem",
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              justifyContent: "start",
              ":hover": {
                backgroundColor: "orange",
              },
            }}
          >
            Select Color
          </Button>
          {isOpenModal && (
            <CustomModal ref={modalRef} onClose={() => setIsOpenModal(false)}>
              <div>
                <Typography variant="h6">Select color</Typography>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap", // Allows buttons to wrap onto the next line
                    gap: "0.2rem", // Adjusts spacing between buttons
                    maxWidth: "20rem",
                  }}
                >
                  {colorsObjectsArray.map(({ label, value }) => (
                    <Controller
                      key={value}
                      name="colors"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <ColorButton
                          label={label}
                          color={value}
                          selected={selectedColors.includes(value)}
                          onClick={() => {
                            const newValue = selectedColors.includes(value)
                              ? selectedColors.filter((c) => c !== value)
                              : [...selectedColors, value];
                            onChange(newValue); // Update the value in React Hook Form
                          }}
                        />
                      )}
                    />
                  ))}
                </div>

                <Typography variant="h6">Selected Colors :</Typography>
                <Box
                  sx={{
                    maxWidth: "320px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".7rem",
                    overflow: "hidden", // Prevent overflow
                  }}
                >
                  {selectedColors?.map((color, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0.8rem 1rem",
                        backgroundColor: color,
                        maxWidth: "100px", // Limit the box width
                        overflow: "hidden",
                        position: "relative", // Prevent overflow of the inner Box
                      }}
                    >
                      <Typography
                        variant="body2" // Change to body2 for better compatibility
                        sx={{
                          color: "white", // Ensure text color is visible on different backgrounds
                          whiteSpace: "nowrap", // Prevent text from wrapping
                          overflow: "hidden", // Hide overflow
                          textOverflow: "ellipsis", // Show ellipsis
                          maxWidth: "100%", // Set to full width of the parent Box
                          display: "block", // Ensure each Typography is treated as a block
                        }}
                      >
                        {color}
                      </Typography>
                      <CloseButton
                        onClick={() => removeColor(color)}
                        icon={<HiXMark />}
                      />
                    </Box>
                  ))}
                </Box>
                {selectedColors.length > 0 && (
                  <Button
                    sx={{
                      backgroundColor: theme.palette.green.main,
                      color: theme.palette.primary.main,
                      marginTop: "1rem",
                    }}
                    type="button"
                    onClick={clearColors}
                  >
                    Clear Colors
                  </Button>
                )}
              </div>
            </CustomModal>
          )}
        </Grid>
        <Grid item xs={6} sm={6} sx={{ marginTop: ".5rem" }}>
          <CustomFileInput
            multiple
            id="file-upload"
            label="Upload Images"
            {...register("images")}
            onChange={handleFileChange}
            sx={{ width: "100%" }} // Make input full width
          />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: "0.5rem", sm: "1rem" }, // Responsive gap
              marginTop: "1rem", // Adjusted margin
            }}
          >
            {imagePreviews?.map((preview, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: { xs: "60px", sm: "80px" }, // Responsive image size
                  height: { xs: "60px", sm: "80px" }, // Keep height consistent
                  borderRadius: "8px",
                  overflow: "hidden", // Ensure no overflow
                  boxShadow: 1, // Optional shadow for depth
                }}
              >
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "100%", // Ensure image fills the box
                    height: "100%", // Ensure image fills the box
                    objectFit: "cover",
                  }}
                />
                <CloseButton
                  onClick={() => handleRemoveImage(index)}
                  icon={<HiXMark />}
                  sx={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    backgroundColor: "white", // Optional: background for better visibility
                    borderRadius: "50%", // Round button
                    padding: "0.2rem",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={6} sm={6}></Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1, // Optional: Adds space between buttons
            }}
          >
            <Button
              sx={{
                backgroundColor: theme.palette.secondary.dark,
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary[800],
                },
              }}
              variant="contained"
              color="primary"
              type="submit" disabled={loading}
            >
            {loading ? 'Creating..' : 'Submit'}
            </Button>
            <Button
              sx={{
                backgroundColor: theme.palette.primary[800],
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
              variant="outlined"
              color="secondary"
              onClick={() => reset()}
            >
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateProduct;
