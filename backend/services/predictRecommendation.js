
import * as tf from '@tensorflow/tfjs-node-gpu';
import {products} from './products.js';

import { createRecommendationModel } from './recommendationModel.js';



export const getUniqueUserCount = async () => {
  try {
    // Find all unique userIds from interactions
    const userIds = await Interaction.distinct('userId');
    return userIds.length;
  } catch (error) {
    console.error('Error fetching unique user count:', error);
    throw error;
  }
};


export const predictRecommendation = async (userId, productId) => {
  try {
    if (userId == null || productId == null) {
      throw new Error('userId or productId is null or undefined');
    }

    console.log(`Predicting for userId: ${userId}, productId: ${productId}`);

    // Dynamically calculate the number of unique users
    const numUsers = await getUniqueUserCount();  // Get the number of unique users from your database
    const numProducts = products.length;  // Assuming you have a static list of products

    // Get the product index from the productId
    const productIndex = products.findIndex(product => product._id === productId);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    // Create the model with the dynamic number of users and products
    const model = createRecommendationModel(numUsers, numProducts, 50);

    // Convert the userId and productIndex into tensors
    const userTensor = tf.tensor([userId], [1, 1]);
    const productTensor = tf.tensor([productIndex], [1, 1]); // Use the product index

    console.log(`User tensor shape: ${userTensor.shape}`);
    console.log(`Product tensor shape: ${productTensor.shape}`);

    // Get the prediction score
    const prediction = model.predict([userTensor, productTensor]);
    const score = prediction.dataSync()[0];  // Get the prediction value

    console.log(`Predicted interaction score for user ${userId} and product ${productId}: ${score}`);
    return score;
  } catch (error) {
    console.error('Error in predictRecommendation:', error.message);
    throw error;
  }
};




export const recommendTopProducts = async (userId, topN = 5) => {
  try {
    const scores = [];

    // Dynamically calculate the number of unique users
    const numUsers = await getUniqueUserCount();  // Get unique user count from database

    // Loop through each product and predict the interaction score
    for (let i = 0; i < products.length; i++) {
      const productId = products[i]._id;  // Keep productId as string for display/other uses
      const score = await predictRecommendation(userId, productId, numUsers);  // Pass the dynamic numUsers
      scores.push({ productId, score });
    }

    // Sort by predicted interaction score in descending order
    scores.sort((a, b) => b.score - a.score);

    // Get the top N products with the highest interaction scores
    const topProducts = scores.slice(0, topN);

    return topProducts;
  } catch (error) {
    console.error('Error in recommendTopProducts:', error.message);
    throw error;
  }
};
