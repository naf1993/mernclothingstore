import mongoose from 'mongoose'

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
        console.log(`Mongodb connected: ${conn.connection.host}`.cyan.underline);


    }catch(error){
        console.log(`error:${error.message}`.red.underline.bold);
        process.exit(1);

    }


}
export default connectDB