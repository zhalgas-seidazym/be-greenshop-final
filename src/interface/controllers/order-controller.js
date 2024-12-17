class OrderController {
    constructor(orderRepository, addressRepository, itemRepository, discountRepository) {
        this.orderRepository = orderRepository;
        this.addressRepository = addressRepository;
        this.itemRepository = itemRepository;
        this.discountRepository = discountRepository;
    }


    async createOrder(req, res) {
        const {shippingAddressId, items, orderNotes} = req.body;
        const userId = req.user.id;

        try {
            const shippingAddress = await this.addressRepository.findById(shippingAddressId);
            if (!shippingAddress || shippingAddress.user.toString() !== userId) {
                return res.status(400).json({detail: "Invalid shipping address"});
            }

            let totalAmount = 0;
            const processedItems = [];
            const currentDate = new Date();

            for (const orderItem of items) {
                const {item: itemId, quantity} = orderItem;

                const item = await this.itemRepository.findById(itemId);
                if (!item) {
                    return res.status(400).json({detail: `Item with ID ${itemId} not found`});
                }

                const activeDiscount = await this.discountRepository.findActiveDiscount(itemId, currentDate);
                let priceAtPurchase = item.cost;
                let discountApplied = 0;

                if (activeDiscount) {
                    discountApplied = activeDiscount.discountPercentage;
                    priceAtPurchase -= (priceAtPurchase * discountApplied) / 100;
                }

                totalAmount += priceAtPurchase * quantity;

                processedItems.push({
                    item: itemId, quantity, priceAtPurchase, discountApplied,
                });
            }

            const orderData = {
                shippingAddress: shippingAddress._id, user: userId, items: processedItems, totalAmount, orderNotes,
            };

            const newOrder = await this.orderRepository.create(orderData);

            return res.status(201).json({detail: "Order created successfully", order: newOrder});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async listUserOrders(req, res) {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        try {
            const orders = await this.orderRepository.findByUser(userId, {
                sort: {createdAt: -1}, skip: skip, limit: limit,
            });

            const totalOrders = await this.orderRepository.countDocuments({user: userId});
            const totalPages = Math.ceil(totalOrders / limit);

            return res.status(200).json({
                orders, pagination: {
                    totalOrders, totalPages, currentPage: page, perPage: limit
                }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async getOrderById(req, res) {
        const {id: orderId} = req.params;
        const userId = req.user.id;

        try {
            const order = await this.orderRepository.findByIdWithDetails(orderId);
            if (!order || order.user.toString() !== userId) {
                return res.status(404).json({detail: "Order not found or access denied"});
            }

            return res.status(200).json({order});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async cancelOrder(req, res) {
        const {id: orderId} = req.params;
        const userId = req.user.id;

        try {
            const order = await this.orderRepository.findById(orderId);
            if (!order || order.user.toString() !== userId) {
                return res.status(404).json({detail: "Order not found or access denied"});
            }

            await this.orderRepository.delete(orderId);
            return res.status(200).json({detail: "Order canceled successfully"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async listAllOrders(req, res) {
        let {page = 1, limit = 10, sort = '-createdAt', status, userId, startDate, endDate} = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page - 1) * limit;

        const filters = {};
        if (status) {
            filters.status = status;
        }
        if (userId) {
            filters.user = userId;
        }
        if (startDate || endDate) {
            filters.createdAt = {};
            if (startDate) {
                filters.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                filters.createdAt.$lte = new Date(endDate);
            }
        }

        try {
            const orders = await this.orderRepository.findAllOrders(filters, {
                sort: sort, skip: skip, limit: limit,
            });

            const totalOrders = await this.orderRepository.countDocuments(filters);
            const totalPages = Math.ceil(totalOrders / limit);

            return res.status(200).json({
                orders, pagination: {
                    totalOrders, totalPages, currentPage: page, perPage: limit,
                }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }
}

export default OrderController;
