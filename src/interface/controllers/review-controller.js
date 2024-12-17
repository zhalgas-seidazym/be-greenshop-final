class ReviewController {
    constructor(reviewRepository, itemRepository) {
        this.reviewRepository = reviewRepository;
        this.itemRepository = itemRepository;
    }

    async createReview(req, res) {
        const {itemId, rating, comment} = req.body;
        const {userId} = req.user;

        try {
            const item = await this.itemRepository.findById(itemId);
            if (!item) {
                return res.status(404).send({detail: "Item not found"});
            }

            const newReview = await this.reviewRepository.create({
                item: itemId,
                user: userId,
                rating,
                comment,
            });

            return res.status(201).send({detail: "Review created successfully", review: newReview});
        } catch (err) {
            console.error(err);
            return res.status(500).send({detail: "Internal Server Error"});
        }
    }

    async getReviews(req, res) {
        const {itemId} = req.params;

        try {
            const reviews = await this.reviewRepository.findByItemId(itemId);
            if (!reviews.length) {
                return res.status(404).send({detail: "No reviews found for this item"});
            }

            return res.status(200).send({reviews});
        } catch (err) {
            console.error(err);
            return res.status(500).send({detail: "Internal Server Error"});
        }
    }

    async getUserReviews(req, res) {
        const {userId} = req.params;

        try {
            const reviews = await this.reviewRepository.findByUserId(userId);
            if (!reviews.length) {
                return res.status(404).send({detail: "No reviews found for this user"});
            }

            return res.status(200).send({reviews});
        } catch (err) {
            console.error(err);
            return res.status(500).send({detail: "Internal Server Error"});
        }
    }

    async deleteReview(req, res) {
        const {reviewId} = req.params;

        try {
            const review = await this.reviewRepository.findById(reviewId);
            if (!review) {
                return res.status(404).send({detail: "Review not found"});
            }

            await this.reviewRepository.delete(reviewId);
            return res.status(200).send({detail: "Review deleted successfully"});
        } catch (err) {
            console.error(err);
            return res.status(500).send({detail: "Internal Server Error"});
        }
    }
}

export default ReviewController;
