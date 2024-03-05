import express from "express";
import { createListing } from "../controller/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";
import { getUserListing } from "../controller/listingController.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);

router.get("/listings/:id", verifyToken, getUserListing);

export default router;
