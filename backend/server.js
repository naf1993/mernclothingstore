

import dotenv from 'dotenv';
import colors from 'colors';
import app from './app.js'
import connectDB from './config/db.js';




dotenv.config();
connectDB();


const PORT = process.env.PORT || 5000

app.listen(PORT,console.log( `server running in ${process.env.NODE_ENV} port ${PORT}`.yellow.bold));


