import express from "express";
import BasketRepository from "../../infrastructure/repositories/basket-repository.js";
import BasketController from "../controllers/basket-controller.js";
import {isAuth} from "../middlewares.js";

const router = express.Router();

const basketRepository = new BasketRepository();
const basketController = new BasketController(basketRepository);

router.use(isAuth);

router.post("/add",  /*
     #swagger.tags = ['addresses']
    */(req, res) => basketController.addItemToBasket(req, res));
router.get("/",  /*
     #swagger.tags = ['addresses']
    */(req, res) => basketController.getBasket(req, res));
router.delete("/remove", /*
     #swagger.tags = ['addresses']
    */ (req, res) => basketController.removeItemFromBasket(req, res));
router.delete("/clear",  /*
     #swagger.tags = ['addresses']
    */(req, res) => basketController.clearBasket(req, res));

export default router;
