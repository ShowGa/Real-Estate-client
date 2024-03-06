import express from "express";
import {
  createListing,
  getUserListing,
  deleteListing,
} from "../controller/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);

router.get("/listings/:id", verifyToken, getUserListing);

router.delete("/delete/:id", verifyToken, deleteListing);

export default router;
