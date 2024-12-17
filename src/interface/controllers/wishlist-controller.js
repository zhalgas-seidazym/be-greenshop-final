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
                const existingItem = wishlist.items.find((i) => i.item.toString() === itemId);

                if (!existingItem) {
                    wishlist.items.push({item: itemId});
                }

                await wishlist.save();
            }

            return res.status(200).json({detail: "Item added to wishlist successfully", wishlist});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }

    async getWishlist(req, res) {
        const userId = req.user.id;

        try {
            const wishlist = await this.wishlistRepository.findByUserId(userId);

            if (!wishlist || wishlist.length === 0) {
                return res.status(404).json({detail: "Wishlist not found"});
            }

            return res.status(200).json({wishlist: wishlist[0]});
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
            wishlistData.items = wishlistData.items.filter((i) => i.item.toString() !== itemId);

            await wishlistData.save();
            return res.status(200).json({detail: "Item removed successfully", wishlist: wishlistData});
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
            return res.status(200).json({detail: "Wishlist cleared successfully", wishlist: wishlistData});
        } catch (err) {
            console.error(err);
            return res.status(500).json({detail: "Internal Server Error"});
        }
    }
}

export default WishlistController;
