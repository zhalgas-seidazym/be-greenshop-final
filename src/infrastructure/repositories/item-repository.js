import BaseRepository from "./base-repository.js";
import ItemModel from "../models/Item-model.js";

class ItemRepository extends BaseRepository {
    constructor() {
        super(ItemModel);
    }

    async findBySku(sku) {
        return this.model.findOne({sku});
    }

    async findWithCategoryAndTags() {
        return this.model.find().populate("categories").select("-__v");
    }

    async findByIdWithRelatedProducts(id) {
        return this.model.findById(id)
            .populate("categories")
            .populate("relatedProducts");
    }

    async filterAndSortItems(req, res) {
        const {category, minPrice, maxPrice, size, sortBy} = req.query;

        try {
            const filters = {
                category,
                minPrice: parseFloat(minPrice),
                maxPrice: parseFloat(maxPrice),
                size,
                sortBy
            };

            const items = await this.itemRepository.filterAndSortItems(filters);
            return res.status(200).json({items});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async getItemsWithDiscounts(filter = {}, sortOption = {}) {
        try {
            const currentDate = new Date();

            return await this.model.aggregate([
                {$match: filter},
                {
                    $lookup: {
                        from: 'discounts',
                        let: {itemId: '$_id'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {$eq: ['$item', '$$itemId']},
                                            {$lte: ['$startDate', currentDate]},
                                            {$gte: ['$endDate', currentDate]},
                                            {$eq: ['$isActive', true]}
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'activeDiscounts'
                    }
                },
                {
                    $addFields: {
                        activeDiscount: {$arrayElemAt: ['$activeDiscounts', 0]},
                        discountCost: {
                            $cond: [
                                {$gt: [{$size: '$activeDiscounts'}, 0]},
                                {
                                    $subtract: [
                                        '$cost',
                                        {$multiply: ['$cost', {$divide: ['$activeDiscounts.discountPercentage', 100]}]}
                                    ]
                                },
                                '$cost'
                            ]
                        },
                        discountPercentage: {$ifNull: [{$arrayElemAt: ['$activeDiscounts.discountPercentage', 0]}, 0]}
                    }
                },
                {$project: {activeDiscounts: 0, activeDiscount: 0, __v: 0}},
                {$sort: sortOption}
            ]);
        } catch (error) {
            throw new Error(`Error in aggregation pipeline: ${error.message}`);
        }
    }
}

export default ItemRepository;
