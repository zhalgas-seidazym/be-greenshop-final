import BaseRepository from "./base-repository.js";
import ItemModel from "../models/Item-model.js";

class ItemRepository extends BaseRepository {
    constructor() {
        super(ItemModel);
    }

    async findBySku(sku) {
        return this.model.findOne({sku});
    }

    async findWithCategoryAndTags(filters, options, skip, limit) {
        return this.model
            .find(filters, options)
            .populate("categories")
            .select("-__v")
            .skip(skip)
            .limit(limit);
    }

    async findByIdWithRelatedProducts(id) {
        return this.model.findById(id)
            .populate("categories")
            .populate("relatedProducts");
    }

    async count(filterQuery) {
        try {
            return await this.model.countDocuments(filterQuery);
        } catch (error) {
            console.error('Error counting documents:', error);
            throw new Error('Failed to count items');
        }
    }
}

export default ItemRepository;
