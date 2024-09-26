import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  FormControlLabel,
  FormGroup,
  Typography,
  useTheme,Box
} from "@mui/material";
import Form from "../components/ui/Form";
import CustomInput from "./ui/CustomInput";
import CustomSelect from "./ui/CustomSelect";
import ColorButton from "./ui/ColorButton";
import axios from "axios";
import { display } from "@mui/system";
import FlexBetween from "./FlexBetween";
import { SketchPicker } from "react-color";
import CustomModal from "./CustomModal";
import useOutsideClick from "hooks/useOutsideClick";
import CustomCheckbox from "./ui/CustomCheckbox";

const colors = [
  `AliceBlue`,
  `AntiqueWhite`,
  `Aqua`,
  `Bisque`,
  `Black`,
  `BlanchedAlmond`,
  `Blue`,
  `BlueViolet`,
  `Brown`,
  `CornflowerBlue`,
  `Crimson`,
  `Cyan`,
  `DarkBlue`,
  `DarkCyan`,
  `DarkGoldenRod`,
  `DarkGrey`,
  `DarkGreen`,
  `DarkKhaki`,
  `DarkMagenta`,
  `DarkOliveGreen`,
  `Darkorange`,
  `DarkOrchid`,
  `DarkRed`,
  `DarkSalmon`,
  `DarkSeaGreen`,
  `DarkSlateBlue`,
  `DeepSkyBlue`,
  `DodgerBlue`,
  `FireBrick`,
  `ForestGreen`,
  `Fuchsia`,
  `Gainsboro`,
  `GhostWhite`,
  `Gold`,
  `GoldenRod`,
  `Gray`,
  `Green`,
  `GreenYellow`,
  `HoneyDew`,
  `HotPink`,
  `IndianRed`,
  `Indigo`,
  `Ivory`,
  `Khaki`,
  `Lavender`,
  `LavenderBlush`,
  `LawnGreen`,
  `LemonChiffon`,
  `LightBlue`,
  `LightCoral`,
  `LightCyan`,
  `LightGoldenRodYellow`,
  `LightGray`,
  `LightGrey`,
  `LightGreen`,
  `LightPink`,
  `LightSalmon`,
  `LightSeaGreen`,
  `LightSkyBlue`,
  `LightSlateGray`,
  `LightSlateGrey`,
  `LightSteelBlue`,
  `LightYellow`,
  `Lime`,
  `LimeGreen`,
  `Linen`,
  `Magenta`,
  `Maroon`,
  `MediumAquaMarine`,
  `MediumBlue`,
  `MediumOrchid`,
  `MediumPurple`,
  `MediumSeaGreen`,
  `MediumSlateBlue`,
  `MediumSpringGreen`,
  `MediumTurquoise`,
  `MediumVioletRed`,
  `MidnightBlue`,

  `MistyRose`,

  `Navy`,
  `OldLace`,
  `Olive`,
  `OliveDrab`,
  `Orange`,
  `OrangeRed`,
  `PaleGoldenRod`,
  `PaleGreen`,
  `PaleTurquoise`,
  `PaleVioletRed`,

  `Pink`,
  `Plum`,

  `Purple`,
  `Red`,

  `RoyalBlue`,

  `Salmon`,
  `SkyBlue`,
  `Teal`,
  `Violet`,
  `Yellow`,
  `YellowGreen`,
];
const colorsObjectsArray = colors.map((color) => ({
  label: color,
  value: color, // or any other transformation for the value
}));

const sizesOptions = [
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
];

const CreateProduct = () => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const modalRef = useRef(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm({
    sizes: [],
  });
  const selectedColors = watch("colors") || [];

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
      } catch (error) {
        console.error("Error fetching categories:", error);
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
          console.error("Error fetching subcategories:", error);
        }
      }

      fetchSubCategories();
    } else {
      setSubCategories([]); // Reset subcategories if no category is selected
    }
  }, [selectedCategory]);

  const onSubmit = (data) => {
    console.log(data);
    // Handle submission logic here
  };
  const clearColors = () => {
    setValue("colors", []); // Clear the colors array
  };

  useOutsideClick(modalRef, () => setIsOpenModal(false));

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FlexBetween gap="1.5rem">
        <CustomInput
          type="text"
          label="Product Name"
          {...register("name", { required: "Product name is required" })}
          error={errors.name?.message}
        />
        <CustomInput
          type="text"
          label="Product Brand"
          {...register("brand", { required: "Brand name is required" })}
          error={errors.brand?.message}
        />
      </FlexBetween>

      <FlexBetween gap="1.5rem">
        <CustomInput
          type="number"
          label="Product Stock"
          {...register("countInStock", { required: "Stock count is required" })}
          error={errors.countInStock?.message}
        />
        <CustomInput
          type="number"
          label="Price"
          {...register("price", { required: "Price is required" })}
          error={errors.price?.message}
        />
      </FlexBetween>
      <FlexBetween gap="1.5rem">
        <CustomSelect
          label="Category"
          options={categories}
          value={selectedCategory}
          {...register("Category", { required: "Category is required" })}
          error={errors.Category?.message}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCategory(value); // Update local state
            setValue("Category", value); // Update react-hook-form state
            setSelectedSubcategory(""); // Reset subcategory when category changes
          }}
        />
        <CustomSelect
          label="Choose SubCategory"
          options={subcategories}
          value={selectedSubcategory}
          {...register("Subcategory", { required: "SubCategory is required" })}
          error={errors.Subcategory?.message}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedSubcategory(value); // Update local state
            setValue("Subcategory", value); // Update react-hook-form state
          }}
        />
      </FlexBetween>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch", // Makes buttons stretch to fill container
          gap: "1.5rem",
          width: "100%",
          marginTop: ".8rem",
        }}
      >
        <Button
          onClick={() => setIsOpenModal((show) => !show)}
          size="small"
          sx={{
            flex: 1,
            alignSelf: "stretch",
            backgroundColor: "white",
            border: `1.9px solid rgba(0, 0, 0, 0.12)`,
            color: theme.palette.primary.textcolor,
            padding: ".8rem .8rem",
            display: "flex",
            alignItems: "center",
            fontSize:'14px',
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
              <Typography variant="body1">
                Current Colors: {selectedColors.join(", ")}
              </Typography>
              <Button type="button" onClick={clearColors}>
                Clear Colors
              </Button>
            </div>
          </CustomModal>
        )}
       
        <Box sx={{flex:1,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Typography variant="h6" sx={{flex:1,marginRight:'.8rem',fontSize:'14px',color:theme.palette.primary.textcolor}}>Size</Typography>
          <Box>
          {sizesOptions.map((option) => (
            <CustomCheckbox
              key={option.value}
              control={control}
              name="sizes"
              value={option.value}
              label={option.label}
            />
          ))}
          </Box>

         
        
        </Box>
      </div>

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Form>
  );
};

export default CreateProduct;
