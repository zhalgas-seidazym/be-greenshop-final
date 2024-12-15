import mongoose, {Schema} from "mongoose";

const ReviewSchema = new Schema(
    {
        item: {type: Schema.Types.ObjectId, ref: "Item", required: true},
        user: {type: Schema.Types.ObjectId, ref: "User", required: true},
        rating: {type: Number, required: true, min: 1, max: 5},
        comment: {type: String, required: false},
    },
    {
        timestamps: true,
    }
);

const ReviewModel = mongoose.model("Review", ReviewSchema);
export default ReviewModel;
