import { cacheRecommendations } from './recommendationModel';

(async () => {
  try {
    // If needed, retrieve the trained model
   
    await cacheRecommendations(recommendationModel);
    console.log('Recommendations cached successfully');
  } catch (error) {
    console.error('Error caching recommendations:', error);
  }
})();
