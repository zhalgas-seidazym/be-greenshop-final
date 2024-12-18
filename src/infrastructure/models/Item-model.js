import mongoose, {Schema} from "mongoose";

const ItemSize = {
    S: "S",
    M: "M",
    L: "L",
    XL: "XL"
};

const ItemSchema = new Schema({
    images: [{type: String, required: false}],
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    cost: {type: Number, required: true},
    size: {type: String, enum: Object.values(ItemSize), required: true, default: ItemSize.S},
    sku: {type: String, required: true, unique: true},
    categories: [{type: Schema.Types.ObjectId, ref: "Category", required: true,}],
    tags: [{type: String, required: false}],
    productDescription: {type: String, required: true},
    relatedProducts: [{type: Schema.Types.ObjectId, ref: "Item"}]
}, {
    timestamps: true,
});

const ItemModel = mongoose.model("Item", ItemSchema);
export default ItemModel;
