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
import List from '../components/List'

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
    array: [70, 100],
  },
  {
    id: 4,
    name: "$1500 to $2000",
    array: [100, 150],
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

const MobileComponet = () => {
  return <h1>this is mobileComponet</h1>;
};

const DesktopComponet = () => {
  return <h1>this is desktop componenet</h1>;
};

const ProductList = ({ categories }) => {
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

  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCats, setSelectedSubCats] = useState([]);
  const [sortFeatures, setSortFeatures] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [colors, setColors] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isActive, setActive] = useState(false);

  //   const subCategoryIds = ['64c9f8bda5410e8da97f6c2d','64c9f93142153fbbdcb2dcdc']
  //  const id = '64c9f8bda5410e8da97f6c2d'

  //  const params = subCategoryIds.map((subCategory)=>{
  //   return `SubCategory=${subCategory}&`
  // })

  //  function parseParams(params) {
  //   const keys = Object.keys(params)
  //   let options = {}

  //   keys.forEach((key) => {
  //     const isParamTypeObject = typeof params[key] === 'object'
  //     const isParamTypeArray = isParamTypeObject && params[key].length >= 0

  //     if (!isParamTypeObject) {
  //       options += `${key}=${params[key]}&`
  //     }

  //     if (isParamTypeObject && isParamTypeArray) {
  //       params[key].forEach((element) => {
  //         options += `${key}=${element}&`
  //       })
  //     }
  //   })

  //   return options ? options.slice(0, -1) : options
  // }
  // useEffect(() => {
  //   async function fetchSub() {
  //     const { data } = await axios.get(`http://localhost:5000/api/products?${params.join('')}`);
  //     //  setSubCategories(data.data.categories)

  //    console.log(data)
  //   }
  //   fetchSub();
  // }, []);

 

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
      value: "isFeatured",
      name: "Featured",
    },
    {
      value: "createdAt",
      name: "New Arrivals",
    },
  ];
  const handleClick = (color) => {
    setSelectedColor(color);
  };

  const handleRadio = (e) => {
    const pricetext = e.target.value;
    const myArray = pricetext.split(",");
    setMinPrice(myArray[0]);
    setMaxPrice(myArray[1]);
  };

  const handleCheckBox = (e) => {
    if (e.target.checked) {
      setSelectedSubCats([...selectedSubCats, e.target.value]);
    } else {
      const newArr = selectedSubCats.filter((item) => item !== e.target.value);
      setSelectedSubCats(newArr);
    }
  };
  useEffect(() => {
    console.log(selectedSubCats);
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
      //  setSubCategories(data.data.categories)

      setSubCategories(data.data.category.subcategories);
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
            {subCategories?.map((item, index) => (
              <div className="category-checkbox" key={index}>
                <CheckBoxButton
                  id={item.id}
                  value={item.id}
                  onChange={handleCheckBox}
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
                    onClick={() => handleClick(color)}
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
                <li key={r.name} onClick={() => {
                  console.log(r.rating)
                  setRating(r.rating)}}>
                  <Rating value={r.rating} text={r.name}></Rating>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="right">
          <div className="sort">
            <div className="sort-options">sort options</div>
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
           
            <List catId={category} minPrice={minPrice} maxPrice={maxPrice} sort={selectedSort} subCats={selectedSubCats} color={selectedColor} rating={rating}/>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
