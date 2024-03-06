import express from "express";
import {
  createListing,
  getUserListing,
  deleteListing,
  updateListing,
} from "../controller/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);

// this id is user id
router.get("/listings/:id", verifyToken, getUserListing);

router.delete("/delete/:id", verifyToken, deleteListing);

router.patch("/update/:id", verifyToken, updateListing);

export default router;
