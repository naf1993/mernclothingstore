import { Interaction } from "../models/productModel.js";
import mongoose from 'mongoose'

export const aggregateInteractions = async (userId) => {
  const userInteractions = await Interaction.find({ userId: mongoose.Types.ObjectId(userId) });
  console.log('Interactions for User:', userInteractions);

  const interactions = await Interaction.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$productId',
        views: { $sum: { $cond: [{ $eq: ['$interactionType', 'view'] }, 1, 0] } },
        purchases: { $sum: { $cond: [{ $eq: ['$interactionType', 'purchase'] }, 1, 0] } },
        addToCart: { $sum: { $cond: [{ $eq: ['$interactionType', 'add_to_cart'] }, 1, 0] } },
        favourites: { $sum: { $cond: [{ $eq: ['$interactionType', 'favourites'] }, 1, 0] } },
      }
    },
    { $sort: { views: -1, purchases: -1, addToCart: -1 } }
  ]);

  console.log('Aggregated Interactions:', interactions);
  return interactions;
};

  