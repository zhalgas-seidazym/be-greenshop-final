import BaseRepository from "./base-repository.js";
import WishlistModel from '../models/wishlist-model.js'

class WishlistRepository extends BaseRepository {
    constructor() {
        super(WishlistModel);
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
