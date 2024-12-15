const mongoose = require("mongoose");
const {Schema} = mongoose;

const CategorySchema = new Schema({
    name: {type: String, required: true},
});

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;