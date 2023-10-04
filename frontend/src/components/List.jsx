import React,{useState,useEffect} from 'react'
import axios from 'axios'

const List = ({catId,minPrice,maxPrice,sort,subCats,color,rating}) => {

  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(false)
  const [data,setData] = useState([])
  let [products,setProducts] = useState([])
  const params = subCats.map((item)=>{
      return `SubCategory=${item}&`
    })

  //   const fetchNewProducts = async () => {
  //   await axios
  //     .get("http://localhost:5000/api/products?sort=-createdAt")
  //     .then((response) => {
  //       setNewProducts(response.data.data.products);
  //     });
  // };

    const getFilteredProducts = async() => {
      console.log('filtering started')
      await axios
      .get(`http://localhost:5000/api/products?Category=${catId}&price[gte]=${minPrice}&price[lte]=${maxPrice}&colors=${color}&${params.join('')}&ratingsAverage[gte]=${rating}`)
      .then((response) => {
        setProducts(response.data.data.products);
      });


    }

    const getAllProductsByCategory = async() => {
      await axios
      .get(`http://localhost:5000/api/products?Category=${catId}`)
      .then((response) => {
        setProducts(response.data.data.products);
      });
    }

    
  useEffect(() => {
    if ((color.length >= 1) || (minPrice.length >= 1) || (maxPrice.length >= 1) || (sort.length >= 1) || (subCats.length >= 1) || (rating.length >= 1) )
    getFilteredProducts()
  }, [color.length,minPrice.length,maxPrice.length,sort.length,subCats.length]);

  useEffect(() => {
    if ((color.length === 0) && (minPrice.length === 0) && (maxPrice.length === 0) && (sort.length === 0) && (subCats.length === 0) && (rating.length === 0) )
    getAllProductsByCategory()
  }, [color.length,minPrice.length,maxPrice.length,sort.length,subCats.length]);

  const getProductsBySubcategory = async()=>{
    const { data } = axios.get("http://localhost:5000/api/products?", {
          params: {
            SubCategory: [subCats],
          },
          paramsSerializer: {
            indexes: null,
          },
        });
       console.log(data)
  }
  useEffect(()=>{
    if((subCats.length >=1))
    getProductsBySubcategory()
  },[subCats.length])

    //   const { data } = axios.get("http://localhost:5000/api/products?", {
    //     params: {
    //       SubCategory: [subCats],
    //     },
    //     paramsSerializer: {
    //       indexes: null,
    //     },
    //   });
    //  console.log(data)
    // async function getFilteredProducts(){
    //   try{
    //     const response =await axios.get(`http://localhost:5000/api/products?${params.join('')}`);
    //     console.log("GET Response")
    //     console.log(response.data);
    //     setData(response.data)

    //   }catch(error){
    //     console.log(error.response.data.message)
    //   }

    // }
    // getFilteredProducts()


    // axios.get(`http://localhost:5000/api/products?${params.join('')}`)
    // .then((response) => {
    //   console.log("GET Response")
    //   console.log(response.data);
    //   setData(response.data)
    // })
    // .catch(function (error) {
    //   console.log(error.response.data.message);
    // });  


  //   const { data } = axios.get(`http://localhost:5000/api/products?${params.join('')}`);
  //  if(data){
  //   console.log(data)
  //  }
  
 

  return (
  <div className='list'>
   {rating && rating}

  </div>
  )
}

export default List