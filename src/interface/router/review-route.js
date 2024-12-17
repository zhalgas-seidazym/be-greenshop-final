import {Router} from 'express';
import ReviewController from '../controllers/review-controller.js';
import ReviewRepository from '../../infrastructure/repositories/review-repository.js';
import ItemRepository from '../../infrastructure/repositories/item-repository.js';
import {isAuth} from '../middlewares.js';

const router = Router();

const reviewRepository = new ReviewRepository();
const itemRepository = new ItemRepository();

const reviewController = new ReviewController(reviewRepository, itemRepository);

router.post('/create', isAuth, /*
    #swagger.tags = ['reviews']
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Create a review for an item.',
        required: true,
        schema: {
            itemId: "607c191e810c19729de860ea",
            rating: 5,
            comment: "Excellent product!"
        }
    }
*/
    (req, res) => reviewController.createReview(req, res));

router.get('/:itemId', /*
    #swagger.tags = ['reviews']
    #swagger.parameters['itemId'] = {
        in: 'path',
        description: 'ID of the item to get reviews for.',
        required: true,
        type: 'string',
        example: '607c191e810c19729de860ea'
    }
*/
    (req, res) => reviewController.getReviews(req, res));

router.get('/user/:userId', /*
    #swagger.tags = ['reviews']
    #swagger.parameters['userId'] = {
        in: 'path',
        description: 'ID of the user to get reviews for.',
        required: true,
        type: 'string',
        example: '5f50c31e5b2c3e2d3d1a44f3'
    }
*/
    (req, res) => reviewController.getUserReviews(req, res));

router.delete('/:reviewId', isAuth, /*
    #swagger.tags = ['reviews']
    #swagger.parameters['reviewId'] = {
        in: 'path',
        description: 'ID of the review to delete.',
        required: true,
        type: 'string',
        example: '607c191e810c19729de860ea'
    }
*/
    (req, res) => reviewController.deleteReview(req, res));

export default router;
