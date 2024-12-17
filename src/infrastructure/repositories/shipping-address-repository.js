import BaseRepository from "./base-repository.js";
import ShippingAddressModel from "../models/shipping-address-model.js";

class ShippingAddressRepository extends BaseRepository {
    constructor() {
        super(ShippingAddressModel);
    }

    async findByUserId(userId) {
        try {
            return await this.model.find({user: userId});
        } catch (error) {
            throw new Error(`Error finding addresses for user: ${error.message}`);
        }
    }
}

export default ShippingAddressRepository;
