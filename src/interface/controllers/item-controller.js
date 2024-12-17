class ItemController {
    constructor(itemRepository, discountRepository) {
        this.itemRepository = itemRepository;
        this.discountRepository = discountRepository;
    }

    async createItem(req, res) {
        const {
            images,
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

        try {
            const existingItem = await this.itemRepository.findBySku(sku);
            if (existingItem) return res.status(400).send({detail: "SKU already exists"});

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
                filter = false
            } = req.query || {};

            const priceFilters = {};
            if (minPrice && !isNaN(parseFloat(minPrice))) priceFilters.minPrice = parseFloat(minPrice);
            if (maxPrice && !isNaN(parseFloat(maxPrice))) priceFilters.maxPrice = parseFloat(maxPrice);

            let filterQuery = {};
            let sortOption = {};

            if (filter === 'true' || filter === true) {
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
                    case "sale":
                        sortOption = {discountPercentage: -1};
                        break;
                    default:
                        sortOption = {};
                }
            }

            let items;
            if (filter === 'true' || filter === true) {
                items = await this.itemRepository.getItemsWithDiscounts(filterQuery, sortOption);
            } else {
                items = await this.itemRepository.findWithCategoryAndTags();
            }

            return res.status(200).json(items);
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }


    async applyDiscounts(items) {
        const itemIds = items.map((item) => item._id);
        const discounts = await this.discountRepository.findDiscountsByItemIds(itemIds);

        const discountMap = {};
        discounts.forEach((discount) => {
            discountMap[discount.item.toString()] = discount;
        });

        return items.map((item) => {
            const discount = discountMap[item._id.toString()];
            if (discount) {
                const discountedPrice = item.cost - (item.cost * discount.discountPercentage) / 100;
                return {
                    ...item.toObject(),
                    originalCost: item.cost,
                    discountPercentage: discount.discountPercentage,
                    discountedCost: discountedPrice.toFixed(2),
                };
            }
            return item;
        });
    }

    async getItemById(req, res) {
        const {id} = req.params;

        try {
            const item = await this.itemRepository.findByIdWithRelatedProducts(id);
            if (!item) return res.status(404).send({detail: "Item not found"});
            return res.status(200).send({item});
        } catch (err) {
            console.error(err);
            return res.status(500).send({detail: "Internal Server Error"});
        }
    }

    async updateItem(req, res) {
        const {id} = req.params;
        const updateData = req.body;

        try {
            const updatedItem = await this.itemRepository.update(id, updateData);
            if (!updatedItem) return res.status(404).send({detail: "Item not found"});
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
