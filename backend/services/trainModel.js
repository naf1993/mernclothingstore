import { aggregateInteractions } from "./interactionService";
import { createRecommendationModel } from "./recommendationModel";

export const trainRecommendationModel = async (userId) => {
  // Gather interaction data for the user
  const interactions = await aggregateInteractions(userId);

  // Extract user-product pairs and labels (1 for interaction, 0 for no interaction)
  const userIds = [];
  const productIds = [];
  const labels = [];

  interactions.forEach(interaction => {
    userIds.push(userId);  // Same user for all interactions
    productIds.push(interaction._id);  // Product ID
    labels.push(interaction.purchases > 0 ? 1 : 0);  // Label as 1 if the user purchased the product, else 0
  });

  // Convert to TensorFlow.js tensors
  const userTensor = tf.tensor(userIds, [userIds.length, 1]);
  const productTensor = tf.tensor(productIds, [productIds.length, 1]);
  const labelTensor = tf.tensor(labels, [labels.length, 1]);

  // Create the recommendation model
  const model = createRecommendationModel(1000, 5000, 50);  // Assuming 1000 users and 5000 products

  // Train the model
  await model.fit([userTensor, productTensor], labelTensor, { epochs: 5, batchSize: 32 });

  console.log('Model training completed');
};


