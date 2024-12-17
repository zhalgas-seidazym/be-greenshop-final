class WishlistController {
    constructor(wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    async addItemToWishlist(req, res) {
        const {itemId} = req.body;
        const userId = req.user.id;

        try {
            let wishlist = await this.wishlistRepository.findByUserId(userId);

            if (!wishlist || wishlist.length === 0) {
                wishlist = await this.wishlistRepository.create({
                    user: userId,
                    items: [{item: itemId}],
                });
            } else {
                wishlist = wishlist[0];
                const existingItem = wishlist.items.find((i) => i.item._id.toString() === itemId);

                if (existingItem) {
                    return res.status(400).json({ detail: "Item already added to wishlist" });
                }

                if (existingItem) {
                    return res.status({"detail": "Already added"});
                }
                wishlist.items.push({item: itemId});
                await wishlist.save();
            }

            return res.status(200).json({detail: "Item added to wishlist successfully"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async getWishlist(req, res) {
        const userId = req.user.id;

        try {
            let data = await this.wishlistRepository.findByUserId(userId);
            let {items} = data[0]

            return res.status(200).json({items});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async removeItemFromWishlist(req, res) {
        const {itemId} = req.body;
        const userId = req.user.id;

        try {
            const wishlist = await this.wishlistRepository.findByUserId(userId);

            if (!wishlist || wishlist.length === 0) {
                return res.status(404).json({detail: "Wishlist not found"});
            }

            const wishlistData = wishlist[0];
            wishlistData.items = wishlistData.items.filter((i) => i.item._id.toString() !== itemId);

            await wishlistData.save();
            return res.status(200).json({detail: "Item removed successfully"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }


    async clearWishlist(req, res) {
        const userId = req.user.id;

        try {
            const wishlist = await this.wishlistRepository.findByUserId(userId);

            if (!wishlist || wishlist.length === 0) {
                return res.status(404).json({detail: "Wishlist not found"});
            }

            const wishlistData = wishlist[0];
            wishlistData.items = [];

            await wishlistData.save();
            return res.status(200).json({detail: "Wishlist cleared successfully"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }
}

export default WishlistController;
