import {tf} from '@tensorflow/tfjs-node'
// Define the recommendation model
export const createRecommendationModel = (numUsers, numProducts, embeddingDim = 50) => {
    // User and product input layers
    const userInput = tf.input({ shape: [1], name: 'user' });
    const productInput = tf.input({ shape: [1], name: 'product' });
  
    // Embedding layers for users and products
    const userEmbedding = tf.layers.embedding({ inputDim: numUsers, outputDim: embeddingDim }).apply(userInput);
    const productEmbedding = tf.layers.embedding({ inputDim: numProducts, outputDim: embeddingDim }).apply(productInput);
  
    // Flatten the embeddings
    const userFlattened = tf.layers.flatten().apply(userEmbedding);
    const productFlattened = tf.layers.flatten().apply(productEmbedding);
  
    // Concatenate user and product embeddings
    const concatenated = tf.layers.concatenate().apply([userFlattened, productFlattened]);
  
    // Feed through fully connected layers
    const x = tf.layers.dense({ units: 128, activation: 'relu' }).apply(concatenated);
    const output = tf.layers.dense({ units: 1, activation: 'sigmoid' }).apply(x);  // Output the interaction score
  
    // Create the model
    const model = tf.model({ inputs: [userInput, productInput], outputs: output });
  
    // Compile the model
    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });
  
    return model;
  };