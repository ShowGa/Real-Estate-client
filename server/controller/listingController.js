import Listing from "../models/listingModel.js";

export const createListing = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);
    return res.status(201).json(newListing);
  } catch (e) {
    next(e);
  }
};
