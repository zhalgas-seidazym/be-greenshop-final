import express from "express";
import WishlistRepository from "../../infrastructure/repositories/wishlist-repository.js";
import WishlistController from "../controllers/wishlist-controller.js";
import {isAuth} from "../middlewares.js";

const router = express.Router();

const wishlistRepository = new WishlistRepository();
const wishlistController = new WishlistController(wishlistRepository);

router.use(isAuth);

router.post("/add",  /*
    #swagger.tags = ['wishlist']
*/ (req, res) => wishlistController.addItemToWishlist(req, res));

router.get("/",  /*
    #swagger.tags = ['wishlist']
*/ (req, res) => wishlistController.getWishlist(req, res));

router.delete("/remove",  /*
    #swagger.tags = ['wishlist']
*/ (req, res) => wishlistController.removeItemFromWishlist(req, res));

router.delete("/clear",  /*
    #swagger.tags = ['wishlist']
*/ (req, res) => wishlistController.clearWishlist(req, res));

export default router;
