import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { aggregateInteractions } from "./interactionService.js";
import { createRecommendationModel } from "./recommendationModel.js";

import * as tf from "@tensorflow/tfjs-node-gpu";

const getProductIndex = (productId, products) => {
  // Example: Assuming products is an array of product objects with a unique '_id' field
  return products.findIndex(
    (product) => product._id.toString() === productId.toString()
  );
};

const trainRecommendationModel = async () => {
  // Fetch users and products from the database
  const users = await User.find();
  const products = await Product.find();

  const numUsers = users.length; // Total number of users
  const numProducts = products.length; // Total number of products

  // Create mappings from user ID to index and product ID to index
  const userIdToIndex = {};
  users.forEach((user, index) => {
    userIdToIndex[user._id.toString()] = index; // Map each user to an index
  });

  const productIdToIndex = {};
  products.forEach((product, index) => {
    productIdToIndex[product._id.toString()] = index; // Map each product to an index
  });

  const userIds = [];
  const productIndices = [];
  const labels = [];

  // Loop through each user to gather interactions
  for (const user of users) {
    // Get interactions for the current user
    const interactions = await aggregateInteractions(user._id);

    // Only add interactions if the user has interacted with any product
    if (interactions && interactions.length > 0) {
      interactions.forEach((interaction) => {
        const productIndex = productIdToIndex[interaction._id.toString()];
        const userIndex = userIdToIndex[user._id.toString()];

        if (productIndex !== undefined && userIndex !== undefined) {
          userIds.push(userIndex); // Add user index
          productIndices.push(productIndex); // Add product index
          if (interaction.purchase > 0) {
            labels.push(1); // Purchase (high-value interaction)
          } else if (interaction.add_to_cart > 0) {
            labels.push(0.8);
            // Add-to-cart (medium-value interaction)
          } else if (interaction.favourites > 0) {
            labels.push(0.5);
          } else {
            labels.push(0.1); // View (low-value interaction)
          }
         
        }
      });
    }
  }

  // Check if we have valid data for training
  console.log("Number of valid interactions: ", userIds.length);
  console.log("User IDs:", userIds);
  console.log("Product Indices:", productIndices);
  console.log("Labels:", labels);

  // If there are no valid interactions, we can't train the model
  if (userIds.length === 0) {
    console.error("No valid interactions found for any users.");
    return;
  }

  // Convert the data into TensorFlow.js tensors
  const userTensor = tf.tensor(userIds, [userIds.length, 1], "int32");
  const productTensor = tf.tensor(
    productIndices,
    [productIndices.length, 1],
    "int32"
  );
  const labelTensor = tf.tensor(labels, [labels.length, 1], "int32");

  console.log("User Tensor Shape:", userTensor.shape);
  console.log("Product Tensor Shape:", productTensor.shape);
  console.log("Label Tensor Shape:", labelTensor.shape);

  // Create and train the recommendation model
  const model = createRecommendationModel(numUsers, numProducts, 50);
  await model.fit([userTensor, productTensor], labelTensor, {
    epochs: 5,
    batchSize: 32,
  });

  console.log("Model training completed");
  return model
};

export default trainRecommendationModel;
