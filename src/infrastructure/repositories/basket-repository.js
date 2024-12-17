import BaseRepository from "./base-repository.js";
import BasketModel from '../models/basket-model.js'

class BasketRepository extends BaseRepository {
    constructor() {
        super(BasketModel);
    }

    async findByUserId(userId) {
        try {
            return await this.model.find({user: userId});
        } catch (error) {
            throw new Error(`Error finding addresses for user: ${error.message}`);
        }
    }
}

export default BaseRepository;
