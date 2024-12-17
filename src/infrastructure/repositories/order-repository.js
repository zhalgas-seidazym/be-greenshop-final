import OrderModel from "../models/order-model.js";
import BaseRepository from "./base-repository.js";

class OrderRepository extends BaseRepository {
    constructor() {
        super(OrderModel);
    }

    async findByUser(userId, options = {}) {
        try {
            return await this.model.find({user: userId}, null, options)
                .populate("shippingAddress")
                .populate("items.item")
                .populate("user");
        } catch (error) {
            throw new Error(`Error finding orders for user: ${error.message}`);
        }
    }

    async findByIdWithDetails(orderId) {
        try {
            return await this.model.findById(orderId)
                .populate("shippingAddress")
                .populate("items.item")
                .populate("user");
        } catch (error) {
            throw new Error(`Error finding order details: ${error.message}`);
        }
    }

    async countAllOrders(filters = {}) {
        try {
            return await this.model.countDocuments(filters);
        } catch (error) {
            throw new Error(`Error counting orders: ${error.message}`);
        }
    }
}

export default OrderRepository;
