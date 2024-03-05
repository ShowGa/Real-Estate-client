import Listing from "../models/listingModel.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);
    return res.status(201).json(newListing);
  } catch (e) {
    next(e);
  }
};

export const getUserListing = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "Sneaky peaky peeping ?"));
  }

  try {
    const userRef = req.params.id;
    const listings = await Listing.find({ userRef });
    return res.status(200).json(listings);
  } catch (e) {
    next(e);
  }
};
