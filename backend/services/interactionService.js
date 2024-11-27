import { Interaction } from "../models/productModel";

export const aggregateInteractions = async (userId) => {
    // Aggregating interactions for a user
    const interactions = await Interaction.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$productId',
          views: { $sum: { $cond: [{ $eq: ['$interactionType', 'view'] }, 1, 0] } },
          purchases: { $sum: { $cond: [{ $eq: ['$interactionType', 'purchase'] }, 1, 0] } },
          addToCart: { $sum: { $cond: [{ $eq: ['$interactionType', 'add_to_cart'] }, 1, 0] } },
          favourites: { $sum: { $cond: [{ $eq: ['$interactionType', 'favourites'] }, 1, 0] } },
        },
      },
      { $sort: { views: -1, purchases: -1, addToCart: -1 } }, // Sorting based on views and purchases
    ]);
    
    return interactions;
  };