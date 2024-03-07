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

export const deleteListing = async (req, res, next) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);
    // check listing existing
    if (!listing) {
      return next(errorHandler(404, "Listing not found !"));
    }

    if (listing.userRef !== req.user.id) {
      return next(errorHandler(403, "Don't you dare to do this !"));
    }

    await Listing.findByIdAndDelete(id);
    res.status(200).json("You just delete a listing !");
  } catch (e) {
    next(e);
  }
};

export const updateListing = async (req, res, next) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);
    // check listing existing
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    if (listing.userRef !== req.user.id) {
      return next(errorHandler(403, "Don't you dare to do this !"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedListing);
  } catch (e) {
    next(e);
  }
};

export const getListing = async (req, res, next) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return next(errorHandler(404, "Listing Not found !"));
    }

    res.status(200).json(listing);
  } catch (e) {
    next(e);
  }
};
