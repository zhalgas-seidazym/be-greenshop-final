import mongoose from "mongoose";

class ItemController {
    constructor(itemRepository, reviewRepository, userRepository) {
        this.itemRepository = itemRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;

    }

    async createItem(req, res) {
        const {
            title,
            shortDescription,
            cost,
            size,
            sku,
            categories,
            tags,
            productDescription,
            relatedProducts
        } = req.body;

        const images = req.files ? req.files.map(file => file.path) : [];

        try {
            const existingItem = await this.itemRepository.findBySku(sku);
            if (existingItem) {
                return res.status(400).send({detail: "SKU already exists"});
            }
            for (const category of categories) {
                if (!mongoose.Types.ObjectId.isValid(category)) {
                    return res.status(400).send({detail: "Invalid type. Must be ObjectId type"});
                }
            }
            const newItem = await this.itemRepository.create({
                images,
                title,
                shortDescription,
                cost,
                size,
                sku,
                categories,
                tags,
                productDescription,
                relatedProducts,
            });

            return res.status(201).send({detail: "Item created successfully", item: newItem});
        } catch (err) {
            console.error(err);
            return res.status(500).send({detail: "Internal Server Error"});
        }
    }

    async getItems(req, res) {
        try {
            const {
                category = null,
                minPrice = null,
                maxPrice = null,
                size = null,
                sortBy = null,
                page = 1,
                limit = 10
            } = req.query || {};
            const priceFilters = {};
            if (minPrice && !isNaN(parseFloat(minPrice))) priceFilters.minPrice = parseFloat(minPrice);
            if (maxPrice && !isNaN(parseFloat(maxPrice))) priceFilters.maxPrice = parseFloat(maxPrice);

            let filterQuery = {};
            let sortOption = {};
            if (category) filterQuery.categories = category;

            if (priceFilters.minPrice !== undefined && priceFilters.maxPrice !== undefined) {
                filterQuery.cost = {$gte: priceFilters.minPrice, $lte: priceFilters.maxPrice};
            } else if (priceFilters.minPrice !== undefined) {
                filterQuery.cost = {$gte: priceFilters.minPrice};
            } else if (priceFilters.maxPrice !== undefined) {
                filterQuery.cost = {$lte: priceFilters.maxPrice};
            }

            if (size) filterQuery.size = size;

            switch (sortBy) {
                case "price-asc":
                    sortOption = {cost: 1};
                    break;
                case "price-desc":
                    sortOption = {cost: -1};
                    break;
                case "new-arrivals":
                    sortOption = {createdAt: -1};
                    break;
                default:
                    sortOption = {};
            }

            const offset = (page - 1) * limit;

            const totalCount = await this.itemRepository.count(filterQuery);

            const totalPages = Math.ceil(totalCount / limit);
            if (offset >= totalCount) {
                return res.status(200).json({
                    metadata: {
                        totalItems: totalCount,
                        totalPages: totalPages,
                        currentPage: parseInt(page, 10),
                        itemsPerPage: parseInt(limit, 10),
                    },
                    data: [],
                });
            }
            const items = await this.itemRepository.findWithCategoryAndTags(filterQuery, sortOption, offset, limit);
            const formattedItems = await Promise.all(items.map(async (item) => {
                const reviews = await this.reviewRepository.findByItemId(item._id);
                const reviewsCount = reviews.length;
                const averageRating = reviewsCount > 0
                    ? parseFloat((reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsCount).toFixed(2))
                    : 0;

                return {
                    id: item._id,
                    images: item.images,
                    title: item.title,
                    cost: item.cost,
                    image: item.images.length > 0 ? item.images[0] : null,
                    reviewsCount: reviewsCount,
                    averageRating: averageRating
                };
            }));

            return res.status(200).json({
                metadata: {
                    totalItems: totalCount,
                    totalPages: totalPages,
                    currentPage: parseInt(page, 10),
                    itemsPerPage: parseInt(limit, 10)
                },
                data: formattedItems
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async getItemById(req, res) {
        const {id} = req.params;

        try {
            const item = await this.itemRepository.findByIdWithRelatedProducts(id);
            if (!item) return res.status(404).send({detail: "Item not found"});

            const reviews = await this.reviewRepository.findByItemId(id);
            let newData = JSON.parse(JSON.stringify(item));
            newData.reviewsCount = reviews.length;
            if (reviews.length > 0) {
                const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
                newData.averageRating = parseFloat(averageRating.toFixed(2));
            } else {
                newData.averageRating = 0;
            }

            return res.status(200).send(newData);
        } catch (err) {
            console.error(err);
            return res.status(500).send({detail: "Internal Server Error"});
        }
    }

    async getItemComments(req, res) {
        const {id} = req.params;
        const {page = 1, limit = 10} = req.query;

        try {
            const reviews = await this.reviewRepository.findByItemId(id, page, limit);
            if (!reviews.length) {
                return res.status(404).send({detail: "No comments found for this item"});
            }

            const reviewsWithUser = await Promise.all(reviews.map(async (review) => {
                const user = await this.userRepository.findById(review.userId);
                return {
                    userId: review.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    rating: review.rating,
                    comment: review.comment
                };
            }));

            return res.status(200).send({reviews: reviewsWithUser});
        } catch (err) {
            console.error(err);
            return res.status(500).send({detail: "Internal Server Error"});
        }
    }

    async updateItem(req, res) {
        const {id} = req.params;
        const {
            title,
            shortDescription,
            cost,
            size,
            sku,
            categories,
            tags,
            productDescription,
            relatedProducts
        } = req.body;

        const images = req.files ? req.files.map(file => file.path) : null;

        try {
            const existingItem = await this.itemRepository.findById(id);
            if (!existingItem) {
                return res.status(404).send({detail: "Item not found"});
            }

            const updatedData = {
                title: title || existingItem.title,
                shortDescription: shortDescription || existingItem.shortDescription,
                cost: cost || existingItem.cost,
                size: size || existingItem.size,
                sku: sku || existingItem.sku,
                categories: categories || existingItem.categories,
                tags: tags || existingItem.tags,
                productDescription: productDescription || existingItem.productDescription,
                relatedProducts: relatedProducts || existingItem.relatedProducts,
            };

            if (images) {
                updatedData.images = images;
            }

            const updatedItem = await this.itemRepository.update(id, updatedData);

            return res.status(200).send({detail: "Item updated successfully", item: updatedItem});
        } catch (err) {
            console.error(err);
            return res.status(500).send({detail: "Internal Server Error"});
        }
    }

    async deleteItem(req, res) {
        const {id} = req.params;

        try {
            const deletedItem = await this.itemRepository.delete(id);
            if (!deletedItem) return res.status(404).send({detail: "Item not found"});
            return res.status(200).send({detail: "Item deleted successfully"});
        } catch (err) {
            console.error(err);
            return res.status(500).send({detail: "Internal Server Error"});
        }
    }
}

export default ItemController;
