import {Router} from 'express';
import OrderController from "../controllers/order-controller.js";
import OrderRepository from "../../infrastructure/repositories/order-repository.js";
import ItemRepository from "../../infrastructure/repositories/item-repository.js";
import {isAdmin, isAuth} from "../middlewares.js";
import {query, validationResult} from 'express-validator';
import ShippingAddressRepository from "../../infrastructure/repositories/shipping-address-repository.js";

const router = Router();

const orderRepository = new OrderRepository();
const addressRepository = new ShippingAddressRepository();
const itemRepository = new ItemRepository();

const orderController = new OrderController(orderRepository, addressRepository, itemRepository);

const validateListAllOrders = [
    query('page').optional().isInt({min: 1}).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({min: 1}).withMessage('Limit must be a positive integer'),
    query('sort').optional().isString().withMessage('Sort must be a string'),
    query('status').optional().isString().withMessage('Status must be a string'),
    query('userId').optional().isMongoId().withMessage('Invalid user ID'),
    query('startDate').optional().isISO8601().withMessage('Invalid start date'),
    query('endDate').optional().isISO8601().withMessage('Invalid end date'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
];

router.post('/', isAuth,
    /*
        #swagger.tags = ['orders']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Order data.',
            required: true,
            schema: {
                shippingAddressId: "60d5f484f1d2c916c4a1b1c1",
                items: [
                    {
                        item: "60d5f484f1d2c916c4a1b1c2",
                        quantity: 2
                    }
                ],
                orderNotes: "Please deliver between 9 AM to 5 PM."
            }
        }
    */
    (req, res) => orderController.createOrder(req, res)
);

router.get('/', isAuth,
    /*
        #swagger.tags = ['orders']
        #swagger.parameters['query'] = {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            required: false,
            type: 'integer'
        },
        #swagger.parameters['query'] = {
            name: 'limit',
            in: 'query',
            description: 'Number of orders per page',
            required: false,
            type: 'integer'
        }
    */
    (req, res) => orderController.listUserOrders(req, res)
);

router.get('/:id', isAuth,
    /*
        #swagger.tags = ['orders']
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID of the order',
            required: true,
            type: 'string'
        }
    */
    (req, res) => orderController.getOrderById(req, res)
);

router.delete('/:id', isAuth,
    /*
        #swagger.tags = ['orders']
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID of the order to cancel',
            required: true,
            type: 'string'
        }
    */
    (req, res) => orderController.cancelOrder(req, res)
);

router.get('/orders/all', isAuth, isAdmin, validateListAllOrders,
    /*
        #swagger.tags = ['orders']
        #swagger.parameters['query'] = {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            required: false,
            type: 'integer'
        },
        #swagger.parameters['query'] = {
            name: 'limit',
            in: 'query',
            description: 'Number of orders per page',
            required: false,
            type: 'integer'
        },
        #swagger.parameters['query'] = {
            name: 'sort',
            in: 'query',
            description: 'Sort order (e.g., -createdAt for descending)',
            required: false,
            type: 'string'
        },
        #swagger.parameters['query'] = {
            name: 'status',
            in: 'query',
            description: 'Filter by order status',
            required: false,
            type: 'string'
        },
        #swagger.parameters['query'] = {
            name: 'userId',
            in: 'query',
            description: 'Filter by user ID',
            required: false,
            type: 'string'
        },
        #swagger.parameters['query'] = {
            name: 'startDate',
            in: 'query',
            description: 'Filter orders created after this date (ISO8601)',
            required: false,
            type: 'string'
        },
        #swagger.parameters['query'] = {
            name: 'endDate',
            in: 'query',
            description: 'Filter orders created before this date (ISO8601)',
            required: false,
            type: 'string'
        }
    */
    (req, res) => orderController.listAllOrders(req, res)
);

export default router;
