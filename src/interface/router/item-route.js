import {Router} from "express";
import ItemController from "../controllers/item-controller.js";
import ItemRepository from "../../infrastructure/repositories/item-repository.js";
import {isAdmin, isAuth} from "../middlewares.js";
import {upload} from "../../utils/multer.js";
import ReviewRepository from "../../infrastructure/repositories/review-repository.js";
import UserRepository from "../../infrastructure/repositories/user-repository.js";

const router = Router();
const itemRepository = new ItemRepository();
const reviewRepository = new ReviewRepository();
const userRepository = new UserRepository();
const itemController = new ItemController(itemRepository, reviewRepository, userRepository);

router.post('/', isAuth, isAdmin,/*
    #swagger.tags = ['items']
    #swagger.parameters['title'] = {
        in: 'formData',
        description: 'Item title.',
        required: true,
        type: 'string',
        example: 'Item Title'
    }
    #swagger.parameters['shortDescription'] = {
        in: 'formData',
        description: 'Item short description.',
        required: true,
        type: 'string',
        example: 'Short description of the item.'
    }
    #swagger.parameters['cost'] = {
        in: 'formData',
        description: 'Item cost.',
        required: true,
        type: 'number',
        example: 99.99
    }
    #swagger.parameters['size'] = {
        in: 'formData',
        description: 'Item size.',
        required: true,
        type: 'string',
        example: 'M'
    }
    #swagger.parameters['sku'] = {
        in: 'formData',
        description: 'Item SKU.',
        required: true,
        type: 'string',
        example: 'ABC123'
    }
    #swagger.parameters['categories'] = {
        in: 'formData',
        description: 'Item categories.',
        required: true,
        type: 'array',
        items: { type: 'string' },
        example: ['electronics', 'gadgets']
    }
    #swagger.parameters['tags'] = {
        in: 'formData',
        description: 'Item tags.',
        required: false,
        type: 'array',
        items: { type: 'string' },
        example: ['sale', 'new']
    }
    #swagger.parameters['productDescription'] = {
        in: 'formData',
        description: 'Item product description.',
        required: true,
        type: 'string',
        example: 'Detailed product description here.'
    }
    #swagger.parameters['relatedProducts'] = {
        in: 'formData',
        description: 'Related products.',
        required: false,
        type: 'array',
        items: { type: 'string' },
        example: ['12345', '67890']
    }
    #swagger.parameters['images'] = {
        in: 'formData',
        description: 'Item images (multiple).',
        required: false,
        type: 'array',
        items: { type: 'file', format: 'binary' },
        example: ['image1.jpg', 'image2.png']
    }
    #swagger.requestBody = {
        description: 'Data to create a new item, including multiple images.',
        required: true
    }
*/
    upload.array("images", 5), async (req, res) => {
        try {
            await itemController.createItem(req, res);
        } catch (error) {
            console.error('Unexpected Error:', error);
            res.status(500).json({detail: 'An unexpected error occurred.'});
        }
    });

router.get("/",
    /*
        #swagger.tags = ['items']
        #swagger.summary = 'Get all items'
        #swagger.description = 'Retrieve a list of all available items.'
        #swagger.parameters['category'] = {
            in: 'query',
            description: 'Filter by category.',
            required: false,
            type: 'string',
            example: 'electronics'
        }
        #swagger.parameters['minPrice'] = {
            in: 'query',
            description: 'Filter by minimum price.',
            required: false,
            type: 'number',
            example: 100
        }
        #swagger.parameters['maxPrice'] = {
            in: 'query',
            description: 'Filter by maximum price.',
            required: false,
            type: 'number',
            example: 500
        }
        #swagger.parameters['size'] = {
            in: 'query',
            description: 'Filter by size.',
            required: false,
            type: 'string',
            example: 'L'
        }
        #swagger.parameters['sortBy'] = {
            in: 'query',
            description: 'Sort items by a specific field.',
            required: false,
            type: 'string',
            enum: ['price-asc', 'price-desc', 'new-arrivals'],
            example: 'price-asc'
        }
        #swagger.response[200] = {
            description: 'Items fetched successfully.',
            schema: { $ref: '#/definitions/Item' }
        }
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

router.put('/:id', isAuth, isAdmin,/*
    #swagger.tags = ['items']
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Item ID to update.',
        required: true,
        type: 'string',
        example: '60a7f3b0e9d7f8378f4f083a'
    }
    #swagger.parameters['title'] = {
        in: 'formData',
        description: 'Item title.',
        required: false,
        type: 'string',
        example: 'Updated Item Title'
    }
    #swagger.parameters['shortDescription'] = {
        in: 'formData',
        description: 'Item short description.',
        required: false,
        type: 'string',
        example: 'Updated short description of the item.'
    }
    #swagger.parameters['cost'] = {
        in: 'formData',
        description: 'Item cost.',
        required: false,
        type: 'number',
        example: 89.99
    }
    #swagger.parameters['size'] = {
        in: 'formData',
        description: 'Item size.',
        required: false,
        type: 'string',
        example: 'L'
    }
    #swagger.parameters['sku'] = {
        in: 'formData',
        description: 'Item SKU.',
        required: false,
        type: 'string',
        example: 'DEF456'
    }
    #swagger.parameters['categories'] = {
        in: 'formData',
        description: 'Item categories.',
        required: false,
        type: 'array',
        items: { type: 'string' },
        example: ['electronics', 'accessories']
    }
    #swagger.parameters['tags'] = {
        in: 'formData',
        description: 'Item tags.',
        required: false,
        type: 'array',
        items: { type: 'string' },
        example: ['featured', 'new']
    }
    #swagger.parameters['productDescription'] = {
        in: 'formData',
        description: 'Item product description.',
        required: false,
        type: 'string',
        example: 'Updated detailed product description.'
    }
    #swagger.parameters['images'] = {
        in: 'formData',
        description: 'Item images (multiple).',
        required: false,
        type: 'array',
        items: { type: 'file', format: 'binary' },
        example: ['updated-image1.jpg', 'updated-image2.png']
    }
    #swagger.requestBody = {
        description: 'Data to update an existing item, including multiple images.',
        required: false
    }
*/
    upload.array('images', 5), async (req, res) => {
        try {
            await itemController.updateItem(req, res);
        } catch (error) {
            console.error('Unexpected Error:', error);
            res.status(500).json({detail: 'An unexpected error occurred.'});
        }
    }
)
;

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

router.get('/:id/comments',
    /*
             #swagger.tags = ['items']
    */
    async (req, res) => {

        try {
            await itemController.getItemComments(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).send({detail: "Internal Server Error"});
        }
    });

export default router;
