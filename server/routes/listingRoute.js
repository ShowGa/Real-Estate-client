import express from "express";
import { createListing } from "../controller/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express();

router.post("/create", verifyToken, createListing);

export default router;
