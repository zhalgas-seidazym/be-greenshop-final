import ReviewModel from "../models/review-model.js";
import BaseRepository from "./base-repository.js";

class ReviewRepository extends BaseRepository {
    constructor() {
        super(ReviewModel);
    }

    async findByItemId(itemId) {
        return this.model.find({item: itemId});
    }

    async findByUserId(userId) {
        return this.model.find({user: userId});
    }
}

export default ReviewRepository;
