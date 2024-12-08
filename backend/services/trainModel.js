import trainRecommendationModel from './recommendationModel';

(async () => {
  try {
    await trainRecommendationModel();
    console.log('Model training completed');
  } catch (error) {
    console.error('Error training the model:', error);
  }
})();
