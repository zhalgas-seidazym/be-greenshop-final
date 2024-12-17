import mongoose from "mongoose";

const BasketSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Item'
            },
            quantity: {
                type: Number,
                required: false
            },
        }
    ],
}, {
    timestamps: true
})

const BasketModel = mongoose.model("Basket", BasketSchema);

export default BasketModel;