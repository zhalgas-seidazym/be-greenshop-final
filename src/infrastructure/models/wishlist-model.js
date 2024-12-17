import mongoose, {Schema} from "mongoose";

const WishlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
        }
    }],
}, {
    timestamps: true
});

const WishlistModel = mongoose.model("Wishlist", WishlistSchema);
export default WishlistModel;