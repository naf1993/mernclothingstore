import {tf} from '@tensorflow/tfjs-node'
import { createRecommendationModel } from './recommendationModel';
export const predictRecommendation = async (userId, productId) => {
  // Create the recommendation model (ensure it's already trained)
  const model = createRecommendationModel(1000, 5000, 50);

  // Predict interaction score for the given user and product
  const userTensor = tf.tensor([userId], [1, 1]);
  const productTensor = tf.tensor([productId], [1, 1]);

  const prediction = model.predict([userTensor, productTensor]);
  const score = prediction.dataSync()[0];  // Get the prediction value

  console.log(`Predicted interaction score for user ${userId} and product ${productId}: ${score}`);
  return score;
};


