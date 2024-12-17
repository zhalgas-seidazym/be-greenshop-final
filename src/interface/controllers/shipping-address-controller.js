class ShippingAddressController {
    constructor(shippingAddressRepository) {
        this.shippingAddressRepository = shippingAddressRepository;
    }

    async createAddress(req, res) {
        const {
            name,
            firstName,
            lastName,
            country,
            town,
            street,
            apartment,
            state,
            zip,
            emailAddress,
            phoneNumber
        } = req.body;
        const userId = req.user.id;
        const addressData = {
            name,
            firstName,
            lastName,
            country,
            town,
            street,
            apartment,
            state,
            zip,
            emailAddress,
            phoneNumber,
            user: userId,
        };
        try {
            const newAddress = await this.shippingAddressRepository.create(addressData);
            return res.status(201).json({detail: "Address created successfully", address: newAddress});
        } catch (err) {
            console.error(err);
            if (err.name === "ValidationError") {
                return res.status(400).json({detail: "Invalid address data", errors: err.errors});
            }
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async getShippingAddress(req, res) {
        const userId = req.user.id;

        try {
            let addresses = await this.shippingAddressRepository.findByUserId(userId);

            if (!addresses || addresses.length === 0) {
                return res.status(404).json({detail: "No addresses found"});
            }

            const simplifiedAddresses = addresses.map(address => ({
                id: address._id,
                name: address.name,
                street: address.street,
                apartment: address.apartment,
                town: address.town,
                country: address.country,
            }));

            return res.status(200).json(simplifiedAddresses);
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async getSingleAddress(req, res) {
        const {id} = req.params;
        const userId = req.user.id;

        try {
            const address = await this.shippingAddressRepository.findById(id);

            if (!address) {
                return res.status(404).json({detail: "Address not found"});
            }

            if (address.user.toString() !== userId) {
                return res.status(403).json({detail: "Access denied"});
            }

            return res.status(200).json({address});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async updateAddress(req, res) {
        const addressId = req.params.id;
        const userId = req.user.id;
        const {
            name,
            firstName,
            lastName,
            country,
            town,
            street,
            apartment,
            state,
            zip,
            emailAddress,
            phoneNumber
        } = req.body;

        try {
            const address = await this.shippingAddressRepository.findById(addressId);

            if (!address) {
                return res.status(404).json({detail: "Address not found"});
            }

            if (address.user.toString() !== userId) {
                return res.status(403).json({detail: "Access denied"});
            }

            const updateData = {
                name: name || address.name,
                firstName: firstName || address.firstName,
                lastName: lastName || address.lastName,
                country: country || address.country,
                town: town || address.town,
                street: street || address.street,
                apartment: apartment || address.apartment,
                state: state || address.state,
                zip: zip || address.zip,
                emailAddress: emailAddress || address.emailAddress,
                phoneNumber: phoneNumber || address.phoneNumber
            };

            const updatedAddress = await this.shippingAddressRepository.update(addressId, updateData);

            if (!updatedAddress) {
                return res.status(404).json({detail: "Address not found after update"});
            }

            return res.status(200).json({detail: "Address updated successfully", address: updatedAddress});
        } catch (err) {
            console.error(err);
            if (err.name === "ValidationError") {
                return res.status(400).json({detail: "Invalid address data", errors: err.errors});
            }
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async deleteAddress(req, res) {
        const addressId = req.params.id;
        const userId = req.user.id;

        try {
            const address = await this.shippingAddressRepository.findById(addressId);

            if (!address) {
                return res.status(404).json({detail: "Address not found"});
            }

            if (address.user.toString() !== userId) {
                return res.status(403).json({detail: "Access denied"});
            }

            await this.shippingAddressRepository.delete(addressId);
            return res.status(200).json({detail: "Address deleted successfully"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }
}

export default ShippingAddressController;
