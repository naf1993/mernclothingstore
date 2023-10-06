import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useViewport from "../useViewport";
import axios from "axios";
import Rating from "../components/Rating";
import { AiOutlineCaretDown } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import RadioButton from "../components/ui/RadioButton";
import CheckBoxButton from "../components/ui/CheckBoxButton";
import ColorButton from "../components/ui/ColorButton";
import List from "../components/List";
import { useRef } from "react";

const prices = [
  {
    id: 0,
    name: "$100 to $400",
    array: [100, 400],
  },
  {
    id: 2,
    name: "$400 to $800",
    array: [400, 800],
  },
  {
    id: 3,
    name: "$800 to $1500",
    array: [800, 1500],
  },
  {
    id: 4,
    name: "$1500 to $2000",
    array: [1500, 2000],
  },
  {
    id: 5,
    name: "$2000 or more",
    array: [2000, 9999],
  },
];

const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2stars & up",
    rating: 2,
  },

  {
    name: "1stars & up",
    rating: 1,
  },
];
const sortMenu = [
  {
    value: "price",
    name: "Price:Low to High",
  },
  {
    value: "-price",
    name: "Price:High to Low",
  },
  {
    value: "-isFeatured",
    name: "Featured",
  },
  {
    value: "createdAt",
    name: "New Arrivals",
  },
];

const ProductList = ({ categories }) => {



  const [checkList, setCheckList] = useState([]);
  const [arr, setArr] = useState([]);
  const [shwArr,setShwAr] = useState([])
  const handleCheck = (event) => {
 
    if (event.target.checked) {
      const index = checkList.findIndex((list) => list.id == event.target.name);
      checkList[index].checked = event.target.checked;
      setCheckList([...checkList]);
      setArr([...arr, event.target.name]);
      setShwAr([...shwArr,{id:event.target.name,name:event.target.value,checked:event.target.checked}])
    } else {
      console.log("this is unchecking checkbox ", event.target.checked);
      const index = checkList.findIndex((list) => list.id == event.target.name);
      checkList[index].checked = false;
      setCheckList([...checkList]);
      const newArr = arr.filter((item) => item !== event.target.name);
      setArr(newArr);
      const newShwAr = shwArr.filter((item)=> item.id !== event.target.name )
      setShwAr(newShwAr)
    }
  };

  const resetClick = () => {
    for (const item of checkList) {
      item.checked = false;
    }

    setCheckList([...checkList]);
    setArr([]);
    setShwAr([])
  };

  const clearCheckbox = (subcat) => {
   
    const index = checkList.findIndex((list) => list.id == subcat);
    checkList[index].checked = false;
    setCheckList([...checkList]);
    const newShwAr = shwArr.filter((item)=> item.id !== subcat )
      setShwAr(newShwAr)

  } 
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  let [searchParams, setSearchParams] = useSearchParams();
  let term = searchParams.get("category");
  //  const sp = new URLSearchParams(search)
  //  const category = sp.get('category') || 'all'
  const location = useLocation();
  const category = location.pathname.split("/")[3];

  const { width } = useViewport();
  const breakpoint = 500;
  const [categoryName, setCategoryName] = useState("");
  const [subCategories, setSubCategories] = useState([]);

  const [sortFeatures, setSortFeatures] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [colors, setColors] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isActive, setActive] = useState(false);
  const [selectedSubCats, setSelectedSubCats] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState([]);


  const handleColor = (color) => {
    setSelectedColor(color);
  };

  const handleRadio = (e) => {
    const pricetext = e.target.value;
    const myArray = pricetext.split(",");
    setMinPrice(myArray[0]);
    setMaxPrice(myArray[1]);
  };

  const handleCheckBox = (e, name) => {
    if (e.target.checked) {
      setSelectedSubCats([...selectedSubCats, e.target.value]);
      setSubCategoryName([...subCategoryName, name]);
    } else {
      const newArr = selectedSubCats.filter((item) => item !== e.target.value);
      setSelectedSubCats(newArr);
      const namesArr = subCategoryName.filter((item) => item !== name);
      setSubCategoryName(namesArr);
    }
  };
  useEffect(() => {
    console.log(selectedSubCats);
    // console.log(subCategoryName);
  }, [selectedSubCats]);

  const toggleActive = () => {
    setActive((isActive) => !isActive);
  };

  const handleSort = (value, name) => {
    setSortFeatures(name);
    setSelectedSort(value);
    setActive(false);
  };

  const handleCloseMenu = () => {
    setSortFeatures("");
    setActive(false);
  };

  useEffect(() => {
    async function fetchSubCategories() {
      const { data } = await axios.get(
        `http://localhost:5000/api/categories/${category}`
      );
      console.log(data);
      setCategoryName(data.data.category.name);
      setSubCategories(data.data.category.subcategories);
      const result = data.data.category.subcategories.map((item) => ({
        id: item.id,
        name: item.name,
        checked: false,
      }));
      console.log('this is result ',result)

      setCheckList(result);
    }
    fetchSubCategories();
  }, []);



  useEffect(() => {
    async function fetchColors() {
      const { data } = await axios.get(
        "http://localhost:5000/api/products/allcolors"
      );

      setColors(data.data.uniqueColors);
    }
    fetchColors();
  }, []);

  return (
    <div className="products-list-wrapper">
      <div className="wrapper">
        <div className="left">
          <div className="filter-1">
            <h6 className="filter-name">Filter By Category</h6>
            {checkList?.map((item, index) => (
              <div className="category-checkbox" key={index}>
                <CheckBoxButton
                  id={item.id}
                  name={item.name}
                  value={item.id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      console.log(e.target.checked);
                      setSelectedSubCats([...selectedSubCats, e.target.name]);
                    } else {
                      console.log(e.target.checked);
                      const newArr = selectedSubCats.filter(
                        (item) => item !== e.target.name
                      );
                      setSelectedSubCats(newArr);
                    }
                  }}
                  text={item.name}
                />
                
              </div>
            ))}
          </div>

          <div className="filter-2">
            <h6 className="filter-name">Filter By Price</h6>

            {prices?.map((item, index) => (
              <div key={index}>
                <RadioButton
                  id={item.id}
                  name="price"
                  value={item.array}
                  text={item.name}
                  onChange={handleRadio}
                />
              </div>
            ))}
          </div>

          <div className="filter-3">
            <h6 className="filter-name">Filter By Color</h6>
            <div className="buttons-wrapper">
              {colors?.map((color, index) => (
                <span key={index} className="filter-color-btn">
                  <button
                    value={color}
                    type="submit"
                    onClick={() => handleColor(color)}
                    style={{
                      backgroundColor: `${color}`,
                    }}
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="filter-4">
            <h6 className="filter-name">Customer Review</h6>
            <ul className="review-filter">
              {ratings.map((r) => (
                <li
                  key={r.name}
                  onClick={() => {
                    console.log(r.rating);
                    setRating(r.rating);
                  }}
                >
                  <Rating value={r.rating} text={r.name}></Rating>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="right">
          <div className="sort">
            <div className="filter-clear-wrapper">
              {category && <h4>{categoryName}</h4>}
              {shwArr && (shwArr.map((item,index)=>(
                <span key={index} className="filter-clear-container">
                  <button className="clear-btn" type='submit'>
                    <span>{item.name}</span>
                    <AiOutlineClose className="icon-filter" onClick={()=>clearCheckbox(item.id)}/> 
                  </button>
                </span>
              )))}
              {/* {shwArr &&
                shwArr.map((item, index) => (
                  <span key={index} className="filter-clear-container">
                    <button className="clear-btn" type="submit">
                      <span>{item}</span>
                      <AiOutlineClose className="icon-filter" />
                    </button>
                  </span>
                ))} */}
              {minPrice && maxPrice && (
                <span className="filter-clear-container">
                  <span>Price:From</span>{" "}
                  <button className="clear-btn" type="submit">
                    <span>{`${minPrice} to ${maxPrice}`}</span>
                    <AiOutlineClose className="icon-filter" />
                  </button>
                </span>
              )}
              {selectedColor && (
                <span className="filter-clear-container">
                  <span>Color:</span>
                  <button className="clear-btn" type="submit">
                    <span>{selectedColor}</span>
                    <AiOutlineClose className="icon-filter" />
                  </button>
                </span>
              )}
              {rating && (
                <span className="filter-clear-container">
                  {" "}
                  <span>Rating</span>
                  <button className="clear-btn" type="submit">
                    <span>{`${rating}` + "" + "stars"}</span>
                    <AiOutlineClose className="icon-filter" />
                  </button>
                </span>
              )}
            </div>
            <div className="dropdown">
              <div className="dropdown-btn" onClick={toggleActive}>
                {sortFeatures ? sortFeatures : "Sort"}
                {sortFeatures ? (
                  <AiOutlineClose onClick={handleCloseMenu} />
                ) : (
                  <AiOutlineCaretDown />
                )}
              </div>
              {isActive && (
                <div className="dropdown-content">
                  {sortMenu.map((option, index) => (
                    <div
                      key={index}
                      className="dropdown-item"
                      onClick={() => handleSort(option.value, option.name)}
                    >
                      {option.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="products">
            <List
              catId={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              sort={selectedSort}
              subCats={selectedSubCats}
              colors={selectedColor}
              ratingsAverage={rating}
            />
       
             
       

            <div className="checkList">
              <div className="title">Your CheckList:</div>
              <div className="list-container">
                {checkList.map((item, index) => (
                  <div key={index}>
                    <input
                      name={item.id}
                      value={item.name}
                      checked={item.checked}
                      type="checkbox"
                      onChange={handleCheck}
                    />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button onClick={resetClick}>Reset all checkbox</button>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
