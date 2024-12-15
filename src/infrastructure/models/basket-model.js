import mongoose from "mongoose";

const BasketSchema = new mongoose.Schema({
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {
    timestamps: true
})

const BasketModel = mongoose.model("Basket", BasketSchema);

module.exports = BasketModel;