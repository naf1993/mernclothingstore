import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,useContext
} from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Typography,
  useTheme,
  Box,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
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
import { createProduct, deleteImageProduct, listProducts } from "../actions/productActions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "./CustomModal1";

const CreateProduct = ({onSuccess = () => {},
  productToEdit = {},
  onCloseModal,
  onEdit,
  isEditing,
}) => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [errorCategory, setErrorCategory] = useState(false);
  const [loadingSubCategory, setLoadingSubCategory] = useState(false);
  const [errorSubCategory, setErrorSubCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [objectUrls, setObjectUrls] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { close } = useContext(ModalContext);
  const productCreate = useSelector((state) => state.productCreate);
  const { loading: isCreating } = productCreate || {};

  const { _id: editId, ...editValues } = productToEdit;
  const deleteProductImage = useSelector((state) => state.deleteProductImage);
  const {
    loading: loadingDeleteimage,
    success: successDeleteImage,
    error: errorDeleteImage,
  } = deleteProductImage;

  const isEditSession = Boolean(editId);
  const isWorking = isCreating || isEditing;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: editValues.name || "",
      brand: editValues.brand || "",
      price: editValues.price || "",
      description: editValues.description || "",
      countInStock: editValues.countInStock || "",
      isFeatured: editValues.isFeatured || false,
      Category: editValues.Category?.id ? String(editValues.Category.id) : "",
      SubCategory: editValues.SubCategory?.id
        ? String(editValues.SubCategory.id)
        : "",
      sizes: editValues.sizes || [],
      colors: editValues.colors || [],
      images: editValues.images || [],
    },
  });

  const selectedColors = watch("colors") || [];

  const colorsObjectsArray = useMemo(
    () => colorsArray.map((color) => ({ label: color, value: color })),
    []
  );
  useEffect(() => {
    if (isEditSession && productToEdit.images) {
     
      setExistingImages(productToEdit.images); // Set existing images
      setImagePreviews(productToEdit.images); // Optionally show previews
     
    }
  }, [isEditSession, productToEdit.images]);
  useEffect(()=>{
    if(imagePreviews){
    console.log('this is image previews',imagePreviews)
    }
  },[imagePreviews])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setValue("images", [...watch("images"), ...files]); // Maintain File objects
  };

  const handleRemoveImage = async (index) => {
    const imageToRemove = imagePreviews[index];
    console.log(imageToRemove)
    console.log(existingImages)
    if (isEditSession && existingImages.includes(imageToRemove) ) {
      try {
        await dispatch(deleteImageProduct(imageToRemove));
       

        // Optionally revoke URL if it was created
        URL.revokeObjectURL(imagePreviews[index]);
        if (successDeleteImage) {
          toast.success("Product Image Deleted");
          const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
          setImagePreviews(updatedPreviews);
          console.log('Calling onSuccess to refresh DataGrid');
          dispatch(listProducts())
          
        }
        if (errorDeleteImage) {
          toast.error(errorDeleteImage);
        }
        close()
    
      } catch (error) {
        toast.error("Unable to delete image from backend");
      }
    } else {
      const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
      setImagePreviews(updatedPreviews);

      // Optionally revoke URL if it was created
      URL.revokeObjectURL(imageToRemove);
    }
  };
  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  const onSubmit = async (data) => {
    console.log("Submitting data", data);
    const formData = new FormData();
    const { Category, SubCategory, ...restData } = data;
    if (selectedCategory) {
      formData.append("Category", selectedCategory);
    }
    if (selectedSubcategory) {
      formData.append("SubCategory", selectedSubcategory);
    }
    const existingImages = productToEdit.images || [];
    

    // Collect new images
    const newImages = watch("images").filter((file) => !existingImages.includes(file));
  
    // Append data to formData
    for (const key in restData) {
      if(key === 'images') continue
      if (restData[key] !== null && restData[key] !== undefined) {
        if (Array.isArray(restData[key])) {
          restData[key].forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, restData[key]);
        }
      }
    }
  
    // Append only new images
    newImages.forEach((file) => {
      formData.append("images", file); // Append new images to FormData
    });
    try {
      if (isEditSession) {
        await onEdit(editId, formData);
      
      } else {
        await dispatch(createProduct(formData));
        toast.success("Product Created");
        
      }

      reset(); // Reset form fields after submission
      setImagePreviews([]); // Clear image previews
      close()
      onSuccess(); // Call the onSuccess function to refresh the DataGrid
    } catch (err) {
      console.error("Error during form submission:", err); // Log the complete error
      toast.error(err.response?.data?.message || "Error submitting form");
  }
  };
  const clearColors = () => {
    setValue("colors", []); // Clear the colors array
  };
  const removeColor = (color) => {
    const updatedColors = selectedColors.filter((col) => col !== color);
    setValue("colors", updatedColors);
  };
  useOutsideClick(modalRef, () => setIsOpenModal(false));
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategory(true);
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/categories"
        );
        const options = data.data.categories.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        setCategories(options);
      } catch (err) {
        setErrorCategory(err);
        toast.error("Failed to load categories.");
      } finally {
        setLoadingCategory(false);
      }
    };
    fetchCategories();
  }, []);

  const fetchSubcategories = useCallback(async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    setLoadingSubCategory(true);
    try {
      console.log(
        `Fetching subcategories from async function category ID: ${categoryId}`
      );
      const { data } = await axios.get(
        `http://localhost:5000/api/categories/${categoryId}`
      );
      const options = data.data.category.subcategories.map((subcategory) => ({
        value: subcategory.id,
        label: subcategory.name,
      }));
      console.log("subcategory from api", options);

      setSubcategories(options);
    } catch (err) {
      setErrorSubCategory(err);
      toast.error("Failed to load subcategories.");
    } finally {
      setLoadingSubCategory(false);
    }
  }, []);

  useEffect(() => {
    if (isEditSession && editValues && categories.length > 0) {
      const categoryId = String(editValues.Category?.id || "");
      const categoryExists = categories.some((cat) => cat.value === categoryId);
      if (categoryExists && !selectedCategory) {
        setSelectedCategory(categoryId);
      }
    }
  }, [
    editValues,
    categories,
    isEditSession,
    selectedCategory,
    fetchSubcategories,
  ]);
  useEffect(() => {
    if (isEditSession) {
      if (selectedCategory) {
        setSubcategories([]);
        fetchSubcategories(selectedCategory);
      }
    } else {
      if (selectedCategory) {
        fetchSubcategories(selectedCategory);
      }
    }
  }, [selectedCategory, isEditSession, fetchSubcategories]);

  useEffect(() => {
    console.log("effect 3");
    if (
      isEditSession &&
      subcategories.length > 0 &&
      subcategories.find(
        (cat) => cat.value === String(editValues.SubCategory?.id)
      )
    ) {
      const subcategoryId = String(editValues.SubCategory?.id || "");

      const subcategoryExist = subcategories.find(
        (cat) => cat.value === subcategoryId
      );
      if (subcategoryExist) {
        setSelectedSubcategory(subcategoryId);
      } else {
        setSelectedSubcategory(""); //clearing
      }
    }
  }, [isEditSession, subcategories, editValues]);

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
          {loadingCategory && <p>loading categories</p>}
          {errorCategory && <p>error fetching category</p>}
          {categories.length > 0 && (
            <CustomSelect
              label="Category"
              options={categories}
              value={selectedCategory}
              {...register("Category", { required: "Category is required" })}
              error={errors.Category?.message}
              onChange={(e) => {
                console.log("this is selected value", e.target.value);
                const value = e.target.value;
                setSelectedCategory(value);
                setSelectedSubcategory("");
                setSubcategories([]); // Reset the subcategory
                fetchSubcategories(value);
                setValue("Category", value); // Sync with form state
              }}
            />
          )}
        </Grid>
        <Grid item xs={6} sm={6}>
          {loadingSubCategory && <p>loading subcategrory</p>}
          {errorSubCategory && <p>error loading subcategory</p>}
          {categories.length > 0 && (
            <CustomSelect
              label="Choose SubCategory"
              options={subcategories} // Ensure this is populated
              value={selectedSubcategory}
              {...register("SubCategory", {
                required: "SubCategory is required",
              })}
              error={errors.SubCategory?.message}
              onChange={(e) => {
                console.log("this is selected subcat ", e.target.value);
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
        <Grid item xs={6} sm={6}>
          <FormControlLabel
            control={<Switch {...register("isFeatured")} color="primary" />}
            label="Is this product a featured product?"
          />
        </Grid>

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
              type="submit"
              disabled={isWorking}
            >
              {isEditSession ? "Edit Product" : "Create Product"}
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
