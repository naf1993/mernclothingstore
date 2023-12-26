import React,{useState,useEffect} from 'react'

const ProductImage = ({images,imageUrl}) => {
 
    const [mainImage,setMainImage] = useState(imageUrl[0])
    
    useEffect(() => {
      console.log(imageUrl)
    
      setMainImage(imageUrl[0]); 
    }, [imageUrl]);

    useEffect(()=>{
console.log('child rendered')
    },[])
  
    
  return (
    <>
     <div className="productdisplay-img-list">
   
                {(imageUrl.length > 1) && (
                  imageUrl.map((image,index)=>(
                    <img key={index}  onClick={() => setMainImage(image)}
                    src={image}
                  />
                  ))
                )}
                
              </div>
              <div className="productdisplay-img">
                <img
                  className="productdisplay-main-img"
                  src={`${mainImage}`}
                />
              </div>
              {/* {mainImage.url} */}
    </>
  )
}

export default ProductImage