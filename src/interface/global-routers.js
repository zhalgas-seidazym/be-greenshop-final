import {Router} from 'express';
import userRouter from './router/user-route.js';
import categoryRoute from "./router/category-route.js";
import itemRouter from "./router/item-route.js";
import shippingAddressRoute from "./router/shipping-address-route.js";
import orderRoute from "./router/order-route.js";
import basketRoute from "./router/basket-route.js";
import wishlistRoute from "./router/wishlist-route.js";

const router = Router();

router.use("/users", userRouter)
router.use("/addresses", shippingAddressRoute)
router.use("/categories", categoryRoute)
router.use("/items", itemRouter)
router.use("/orders", orderRoute)
router.use("/baskets", basketRoute)
router.use("/wishlists", wishlistRoute)
export default router;