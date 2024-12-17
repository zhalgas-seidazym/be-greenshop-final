import BaseRepository from "./base-repository.js";
import DiscountModel from "../models/discount-model.js";

class DiscountRepository extends BaseRepository {
    constructor() {
        super(DiscountModel);
    }

    async findDiscountsByItemIds(itemIds) {
        return this.model.find({item: {$in: itemIds}});
    }

    async findActiveDiscount(itemId, date) {
        try {
            return await this.model.findOne({
                item: itemId,
                startDate: {$lte: date},
                endDate: {$gte: date},
                isActive: true
            }).exec();
        } catch (error) {
            throw new Error(`Error finding active discount: ${error.message}`);
        }
    }
}

export default DiscountRepository;
