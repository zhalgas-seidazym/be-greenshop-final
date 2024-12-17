import BaseRepository from "./base-repository.js";
import ItemModel from "../models/Item-model.js";

class ItemRepository extends BaseRepository {
    constructor() {
        super(ItemModel);
    }

    async findBySku(sku) {
        return this.model.findOne({sku});
    }

    async findWithCategoryAndTags(filters, options) {
        return this.model.find(filters, options).populate("categories").select("-__v");
    }

    async findByIdWithRelatedProducts(id) {
        return this.model.findById(id)
            .populate("categories")
            .populate("relatedProducts");
    }
}

export default ItemRepository;
