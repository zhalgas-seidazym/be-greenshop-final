class CategoryController {
    constructor(categoryRepository, itemRepository) {
        this.categoryRepository = categoryRepository;
        this.itemRepository = itemRepository
    }

    async createCategory(req, res) {
        const { name } = req.body;

        try {
            const existingCategory = await this.categoryRepository.findByName(name);
            if (existingCategory) {
                return res.status(400).send({ detail: "Category already exists" });
            }

            const newCategory = await this.categoryRepository.create({ name });
            return res.status(201).send({ detail: "Category created successfully", category: newCategory });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ detail: "Internal Server Error" });
        }
    }

    async getCategories(req, res) {
        const { itemName, size } = req.query;
    
        try {
            const categories = await this.categoryRepository.getAllCategories();
    
            const formattedCategories = await Promise.all(
                categories.map(async (category) => {
                    const filterQuery = {
                        categories: category._id,
                        ...(itemName && { title: new RegExp(itemName, "i") }),
                        ...(size && { size }),
                    };
    
                    const itemQuantity = await this.itemRepository.count(filterQuery);
    
                    return {
                        id: category._id,
                        name: category.name,
                        itemQuantity,
                    };
                })
            );
    
            return res.status(200).send({ categories: formattedCategories });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ detail: "Internal Server Error" });
        }
    }
    


    async getCategoryById(req, res) {
        const { id } = req.params;

        try {
            const category = await this.categoryRepository.findById(id);
            if (!category) {
                return res.status(404).send({ detail: "Category not found" });
            }
            return res.status(200).send({ category });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ detail: "Internal Server Error" });
        }
    }

    async updateCategory(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        try {
            const updatedCategory = await this.categoryRepository.update(id, { name });
            if (!updatedCategory) {
                return res.status(404).send({ detail: "Category not found" });
            }
            return res.status(200).send({ detail: "Category updated successfully", category: updatedCategory });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ detail: "Internal Server Error" });
        }
    }

    async deleteCategory(req, res) {
        const { id } = req.params;

        try {
            const deletedCategory = await this.categoryRepository.delete(id);
            if (!deletedCategory) {
                return res.status(404).send({ detail: "Category not found" });
            }
            return res.status(200).send({ detail: "Category deleted successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ detail: "Internal Server Error" });
        }
    }
}

export default CategoryController;
