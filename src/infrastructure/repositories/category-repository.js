import CategoryModel from "../models/category-model.js";
import BaseRepository from "./base-repository.js";

class CategoryRepository extends BaseRepository {
    constructor() {
        super(CategoryModel);
    }

    async findByName(name) {
        return this.model.findOne({name});
    }

    async getAllCategories() {
        return this.model.find();
    }
}

export default CategoryRepository;
