import {Router} from 'express';
import ShippingAddressController from "../controllers/shipping-address-controller.js";
import ShippingAddressRepository from "../../infrastructure/repositories/shipping-address-repository.js";
import {isAuth} from "../middlewares.js";

const router = Router();

const shippingAddressController = new ShippingAddressController(new ShippingAddressRepository());

router.post('/shipping', isAuth, /*
     #swagger.tags = ['shipping-addresses']
     #swagger.parameters['body'] = {
         in: 'body',
         description: 'Shipping address data.',
         required: true,
         schema: {
             name: "John Doe",
             firstName: "John",
             lastName: "Doe",
             country: "USA",
             town: "New York",
             street: "5th Avenue",
             apartment: "15A",
             state: "NY",
             zip: "10001",
             emailAddress: "john.doe@example.com",
             phoneNumber: "+1234567890"
         }
     }
    */
    (req, res) => shippingAddressController.createAddress(req, res));

// Route to get all shipping addresses of the authenticated user
router.get('/shipping', isAuth, /*
     #swagger.tags = ['shipping-addresses']
    */
    (req, res) => shippingAddressController.getShippingAddress(req, res));

// Route to get a specific shipping address by its ID
router.get('/shipping/:id', isAuth, /*
     #swagger.tags = ['shipping-addresses']
    */
    (req, res) => shippingAddressController.getSingleAddress(req, res));

// Route to update a shipping address by its ID
router.put('/shipping/:id', isAuth, /*
     #swagger.tags = ['shipping-addresses']
     #swagger.parameters['body'] = {
         in: 'body',
         description: 'Updated shipping address data.',
         required: true,
         schema: {
             name: "John Doe",
             firstName: "John",
             lastName: "Doe",
             country: "USA",
             town: "New York",
             street: "5th Avenue",
             apartment: "15A",
             state: "NY",
             zip: "10001",
             emailAddress: "john.doe@example.com",
             phoneNumber: "+1234567890"
         }
     }
    */
    (req, res) => shippingAddressController.updateAddress(req, res));

// Route to delete a specific shipping address by its ID
router.delete('/shipping/:id', isAuth, /*
     #swagger.tags = ['shipping-addresses']
    */
    (req, res) => shippingAddressController.deleteAddress(req, res));


export default router;