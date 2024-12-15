import mongoose, {Schema} from "mongoose";

const DiscountSchema = new Schema(
    {
        item: {type: Schema.Types.ObjectId, ref: "Item", required: true},
        discountPercentage: {type: Number, required: true, min: 0, max: 100},
        startDate: {type: Date, required: true},
        endDate: {type: Date, required: true},
        isActive: {type: Boolean, default: true},
    },
    {
        timestamps: true,
    }
);

const DiscountModel = mongoose.model("Discount", DiscountSchema);
module.exports = DiscountModel;
