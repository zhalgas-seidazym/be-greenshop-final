class BasketController {
    constructor(basketRepository) {
        this.basketRepository = basketRepository;
    }

    async addItemToBasket(req, res) {
        const {itemId, quantity} = req.body;
        const userId = req.user.id;

        try {
            let basket = await this.basketRepository.findByUserId(userId);

            if (!basket || basket.length === 0) {
                basket = await this.basketRepository.create({
                    user: userId,
                    items: [{item: itemId, quantity}],
                });
            } else {
                basket = basket[0];
                const existingItem = basket.items.find((i) => i.item.toString() === itemId);

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    basket.items.push({item: itemId, quantity});
                }
                await basket.save();
            }

            return res.status(200).json({detail: "Item added to basket successfully", basket});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async getBasket(req, res) {
        const userId = req.user.id;

        try {
            const basket = await this.basketRepository.findByUserId(userId);

            if (!basket || basket.length === 0) {
                return res.status(404).json({detail: "Basket not found"});
            }

            return res.status(200).json({basket: basket[0]});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async removeItemFromBasket(req, res) {
        const {itemId} = req.body;
        const userId = req.user.id;

        try {
            const basket = await this.basketRepository.findByUserId(userId);

            if (!basket || basket.length === 0) {
                return res.status(404).json({detail: "Basket not found"});
            }

            const basketData = basket[0];
            basketData.items = basketData.items.filter((i) => i.item.toString() !== itemId);

            await basketData.save();
            return res.status(200).json({detail: "Item removed successfully", basket: basketData});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async clearBasket(req, res) {
        const userId = req.user.id;

        try {
            const basket = await this.basketRepository.findByUserId(userId);

            if (!basket || basket.length === 0) {
                return res.status(404).json({detail: "Basket not found"});
            }

            const basketData = basket[0];
            basketData.items = [];

            await basketData.save();
            return res.status(200).json({detail: "Basket cleared successfully", basket: basketData});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }
}

export default BasketController;
