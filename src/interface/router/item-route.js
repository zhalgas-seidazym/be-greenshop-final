import {Router} from "express";
import ItemController from "../controllers/item-controller.js";
import ItemRepository from "../../infrastructure/repositories/item-repository.js";
import {isAdmin, isAuth} from "../middlewares.js";
import DiscountRepository from "../../infrastructure/repositories/discount-repository.js";

const router = Router();
const itemRepository = new ItemRepository();
const discountRepository = new DiscountRepository();
const itemController = new ItemController(itemRepository, discountRepository);

router.post("/", isAuth, isAdmin,
    /*
        #swagger.tags = ['items']
        #swagger.summary = 'Create a new item'
        #swagger.description = 'Endpoint to create a new item with the provided details.'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Item creation data',
            required: true,
            schema: {
                images: "image-url",
                title: "New Item",
                shortDescription: "Short description of the item",
                cost: 29.99,
                size: "M",
                sku: "ITEM12345",
                categories: ["63e1bc38f5c7b1234567890b"],
                tags: ["tag1", "tag2"],
                productDescription: "Detailed product description",
                relatedProducts: ["63e1bc38f5c7b1234567890c"]
            }
        }
    */
    (req, res) => itemController.createItem(req, res)
);

router.get("/",
    /*
        #swagger.tags = ['items']
        #swagger.summary = 'Get all items'
        #swagger.description = 'Retrieve a list of all available items.'
    */
    (req, res) => itemController.getItems(req, res)
);

router.get("/:id",
    /*
        #swagger.tags = ['items']
        #swagger.summary = 'Get an item by ID'
        #swagger.description = 'Retrieve details of a specific item using its ID.'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            description: 'The ID of the item',
            type: 'string'
        }
    */
    (req, res) => itemController.getItemById(req, res)
);

router.put("/:id", isAuth, isAdmin,
    /*
        #swagger.tags = ['items']
        #swagger.summary = 'Update an item'
        #swagger.description = 'Update the details of an existing item using its ID. You can also update associated categories.'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            description: 'The ID of the item to update',
            type: 'string'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            description: 'Updated item data. You can update categories by providing an array of category IDs.',
            schema: {
                title: "Updated Item Title",
                cost: 49.99,
                size: "L",
                tags: ["updatedTag1", "updatedTag2"],
                categories: ["63e1bc38f5c7b1234567890b", "63e1bc38f5c7b1234567890c"]
            }
        }
    */
    (req, res) => itemController.updateItem(req, res)
);

router.delete("/:id", isAuth, isAdmin,
    /*
        #swagger.tags = ['items']
        #swagger.summary = 'Delete an item'
        #swagger.description = 'Delete a specific item using its ID.'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            description: 'The ID of the item to delete',
            type: 'string'
        }
    */
    (req, res) => itemController.deleteItem(req, res)
);

export default router;
