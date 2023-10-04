import React,{useState,useEffect} from 'react'
import axios from 'axios'

const List = ({catId,minPrice,maxPrice,sort,subCats,colors,ratingsAverage}) => {

  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(false)
  const [data,setData] = useState([])
  let [products,setProducts] = useState([])
  const params = subCats.map((item)=>{
      return `SubCategory=${item}&`
    })

   
    const price = 'price'
   

  //   const fetchNewProducts = async () => {
  //   await axios
  //     .get("http://localhost:5000/api/products?sort=-createdAt")
  //     .then((response) => {
  //       setNewProducts(response.data.data.products);
  //     });
  // };

    // const getFilteredProducts = async() => {
    //   console.log('filtering started')
    //   await axios
    //   .get(`http://localhost:5000/api/products?Category=${catId}&price[gte]=${minPrice}&price[lte]=${maxPrice}&colors=${color}&${params.join('')}&ratingsAverage[gte]=${rating}`)
    //   .then((response) => {
    //     setProducts(response.data.data.products);
    //   });


    // }

    const getAllProductsByCategory = async() => {
      await axios
      .get(`http://localhost:5000/api/products?Category=${catId}`)
      .then((response) => {
        setProducts(response.data.data.products);
      });
    }

    
  // useEffect(() => {
  //   if ((color.length >= 1) || (minPrice.length >= 1) || (maxPrice.length >= 1) || (sort.length >= 1) || (subCats.length >= 1) || (rating.length >= 1) )
  //   getFilteredProducts()
  // }, [color.length,minPrice.length,maxPrice.length,sort.length,subCats.length]);

  useEffect(() => {
    if ((colors.length === 0) && (minPrice.length === 0) && (maxPrice.length === 0) && (sort.length === 0) && (subCats.length === 0) && (ratingsAverage.length === 0) )
    getAllProductsByCategory()
  }, [colors.length,minPrice.length,maxPrice.length,sort.length,subCats.length,ratingsAverage.length]);

  // const parseParams = (params) => {


  //   const keys = Object.keys(params);
  //   let options = '';
  
  //   keys.forEach((key) => {
  //     const isParamTypeObject = typeof params[key] === 'object';
  //     const isParamTypeArray = isParamTypeObject && (params[key].length >= 0);
  
  //     if (!isParamTypeObject) {
  //       options += `${key}=${params[key]}&`;
  //     }
  
  //     if (isParamTypeObject && isParamTypeArray) {      
  //       params[key].forEach((element) => {
  //         options += `${key}=${element}&`;
  //       });
  //     }
  //   });
  
  //   return options ? options.slice(0, -1) : options;
  // };

  
  const getProductsBySubcategory = async()=>{

   
    const params = {
      ...(catId && {
        Category:catId
      }),
      ...(subCats && {
        SubCategory:subCats,
      }),
      ...(minPrice && {
        [`${price+''+'[gte]'}`]:minPrice
      }),
      ...(maxPrice && {
        [`${price+'[lte]'}`]:maxPrice
      }),
      ...(colors && {
        colors:colors
      }),
      ...(ratingsAverage && {
        [`${ratingsAverage+''+'[gte]'}`]:ratingsAverage
      }),
      ...(sort && {
        sort:sort
      })
     
    
    }
    //  for(const key of Object.keys(params)){
    //   if(params[key] === '')
    //   delete params[key]
    //  }
    const { data } = axios.get(`http://localhost:5000/api/products?`, {
          params,
          paramsSerializer: {
            indexes:false
          }
        });
       console.log(data)
  }
  useEffect(()=>{
    if((subCats.length >=1) || (minPrice.length >=1) || (maxPrice.length >=1) || (colors.length >=1) || (sort.length >=1) || (ratingsAverage.length >=1))
    getProductsBySubcategory()
  },[subCats.length,minPrice.length,maxPrice.length,colors.length,sort.length,ratingsAverage.length])

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
 <p>this is minimum price ...{minPrice && minPrice}</p> 
 <p>this is maximum price ... {maxPrice && maxPrice}</p>
 <p>this are colors ... {colors && colors}</p>
 <p>sorting according to ... {sort && sort}</p>
<p>rating is ...{ratingsAverage && ratingsAverage}</p>
  {ratingsAverage && ratingsAverage}
  

  </div>
  )
}

export default List