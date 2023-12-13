import React,{useState,useEffect} from 'react'

const ProductImage = ({images}) => {
 
    const [mainImage,setMainImage] = useState(images[0])
    
    useEffect(() => {
      setMainImage(images[0]); 
    }, [images]);

    useEffect(()=>{
console.log('child rendered')
    },[])
  
    
  return (
    <>
     <div className="productdisplay-img-list">
   
                {(images.length > 1) && (
                  images.map((image,index)=>(
                    <img key={index}  onClick={() => setMainImage(image)}
                    src={`http://localhost:3000/public/products/${image}`}
                  />
                  ))
                )}
                
              </div>
              <div className="productdisplay-img">
                <img
                  className="productdisplay-main-img"
                  src={`http://localhost:3000/public/products/${mainImage}`}
                />
              </div>
    </>
  )
}

export default ProductImage