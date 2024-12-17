import mongoose, {Schema} from "mongoose";

const CategorySchema = new Schema({
    name: {type: String, required: true, unique: true, trim: true},
});

const CategoryModel = mongoose.model('Category', CategorySchema);

export default CategoryModel