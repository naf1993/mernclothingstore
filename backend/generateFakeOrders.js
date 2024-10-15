import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from './models/userModel.js'; 
import Order from './models/orderModel.js'
import Product from './models/productModel.js'

const deleteOrdersMany = async()=>{
    try {
      await mongoose.connect('mongodb+srv://nafitha1993:fptc4Ede6kjJFDNc@eshop.uqdktjs.mongodb.net/?retryWrites=true&w=majority&appName=eshop', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const ordersToDelete = await Order.find().sort({createdAt:-1}).limit(11)
      if(ordersToDelete.length === 0){
        console.log('no orders to delete')
        return
      }
      const orderIds = ordersToDelete.map((order)=>order._id)
      await Order.deleteMany({_id:{$in:orderIds}})
      console.log('deleted 11 last orders')
        await mongoose.connection.close()
    }catch(error){
      console.error('error deleting orders')
    }
  }

const getRandomDate = (startDate, endDate) => {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const randomTimestamp = Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) + startTimestamp;
    return new Date(randomTimestamp);
  };
const generateFakeOrders = async (numOrders) => {
  try {
    await mongoose.connect('mongodb+srv://nafitha1993:fptc4Ede6kjJFDNc@eshop.uqdktjs.mongodb.net/?retryWrites=true&w=majority&appName=eshop', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

    // Fetch all users excluding admins
    const users = await User.find({ isAdmin: false });
    const products = await Product.find()

    if (users.length === 0 || products.length === 0) {
      console.log('No users or products found.');
      return;
    }

    const orders = [];
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-10-31');

    for (let i = 0; i < numOrders; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      console.log('this is random user ',randomUser.name)
      
      // Generate random dates between October 1, 2024, and December 31, 2024
      const randomSaleDate = getRandomDate(startDate, endDate);
      console.log('this is random date',randomSaleDate.toISOString())
      
        const randomProducts = []
        const productCount = Math.floor(Math.random()*3)+1
        console.log('this is product count',productCount)
//  Math.random(): This function generates a random floating-point number between 0 (inclusive) and 1 (exclusive). For example, it can return values like 0.42, 0.98, etc.
// Math.random() * 3: By multiplying the random number by 3, you scale the range of possible values to be between 0 and 3 (exclusive). This means it can produce values like 0, 1.5, or 2.9.
// Math.floor(...): This function rounds down the floating-point number to the nearest integer. So, if the result from the previous step was 2.9, Math.floor(2.9) would return 2. The possible integer outcomes here are 0, 1, or 2.
// Math.floor(Math.random() * 3) + 1: Finally, by adding 1, you adjust the possible integer outcomes to be between 1 and 3 (inclusive). This means the final value of productCount will be 1, 2, or 3.
        for(let j=0;j<productCount;j++){
            const randomProduct = products[Math.floor(Math.random()*products.length)]
            console.log('this is random product',randomProduct.name)
            if(randomProduct.countInStock > 5){
                const quantity = Math.min(3,randomProduct.countInStock)
                console.log('this is quantity',quantity)
                randomProducts.push({
                    product:randomProduct._id,
                    count:quantity,
                    color:randomProduct.colors[0],
                    size:randomProduct.sizes[0] || '',
                    price:randomProduct.price
                })
                await Product.findByIdAndUpdate(randomProduct._id, {
                    $inc: { countInStock: -quantity, sold: quantity },
                  });
            }
        }
        if(randomProducts.length === 0) continue

     
//Math.random(): This function generates a random floating-point number between 0 (inclusive) and 1 (exclusive). For example, it can return values like 0.42, 0.98, etc.
// Math.random() * products.length: By multiplying the random number by products.length, you scale the range of possible values to be between 0 and the number of products in the products array (exclusive). For example, if there are 5 products, this results in values between 0 and 5 (exclusive).
// Math.floor(...): This function rounds down the floating-point number to the nearest integer. So, if the result from the previous step was 3.7, Math.floor(3.7) would return 3. The possible integer outcomes will be in the range from 0 to products.length - 1.
// products[Math.floor(Math.random() * products.length)]: Finally, this expression uses the integer generated in the previous steps as an index to select a random product from the products array.
      
      const order = {
        user: randomUser._id,
        products: randomProducts,
        address: {
          fullName: randomUser.name,
          streetName: faker.location.streetAddress(),
          city: faker.location.city(),
          country: faker.location.country(),
          postalCode: faker.location.zipCode(),
        },
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Not Processed',
        totalPrice: randomProducts.reduce((acc,item)=>acc+(item.price*item.count),0), // Ensure totalPrice is a float
        discount: 0,
        finalPrice: randomProducts.reduce((acc,item)=>acc+(item.count*item.price),0), // Ensure finalPrice is a float
        saleDate: randomSaleDate,
        createdAt: randomSaleDate,
      };
console.log('this is order',order)
      orders.push(order);
    }

    // Insert orders into the database
    await Order.insertMany(orders);
    console.log(`${numOrders} fake orders generated successfully!`);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error generating fake orders:', error);
  }
};

// Generate 20 fake orders
generateFakeOrders(5);
//deleteOrdersMany()

const updateCountInStock = async()=>{
    try
    { await mongoose.connect('mongodb+srv://nafitha1993:fptc4Ede6kjJFDNc@eshop.uqdktjs.mongodb.net/?retryWrites=true&w=majority&appName=eshop', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const result = await Product.updateMany(
        {countInStock:{$type:'string'}},
        [
            {$set:{
                countInStock:{$toInt:'$countInStock'}
            }}
        ]
      )
      console.log(`Updated ${result.modifiedCount} products successfully.`);
    }
    catch(error){
        console.error('error updating products')
    }
}
//updateCountInStock()