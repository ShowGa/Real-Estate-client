import express from "express";
import {
  createListing,
  getUserListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controller/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);

// this id is user id, find all listing from the user
router.get("/listings/:id", verifyToken, getUserListing);

router.delete("/delete/:id", verifyToken, deleteListing);

router.patch("/update/:id", verifyToken, updateListing);

// this id is Listing _id, no need to verify , everyone can get.
router.get("/get/:id", getListing);

// Search bar Route
router.get("/get", getListings);

export default router;
