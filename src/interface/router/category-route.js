import {Router} from "express";
import CategoryController from "../controllers/category-controller.js";
import CategoryRepository from "../../infrastructure/repositories/category-repository.js";
import ItemRepository from "../../infrastructure/repositories/item-repository.js";
import {isAdmin, isAuth} from "../middlewares.js";

const router = Router();
const categoryController = new CategoryController(new CategoryRepository(), new ItemRepository());

router.post("/", isAuth, isAdmin,
    /*
        #swagger.tags = ['categories']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Create a new category',
            required: true,
            schema: { name: "Electronics" }
        }
    */
    (req, res) => categoryController.createCategory(req, res)
);

router.get("/",
    /*
        #swagger.tags = ['categories']
    */
    (req, res) => categoryController.getCategories(req, res)
);

router.get("/:id",
    /*
        #swagger.tags = ['categories']
        #swagger.parameters['id'] = { description: 'Category ID', required: true }
    */
    (req, res) => categoryController.getCategoryById(req, res)
);

router.put("/:id", isAuth, isAdmin,
    /*
        #swagger.tags = ['categories']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Update category name',
            required: true,
            schema: { name: "Updated Electronics" }
        }
    */
    (req, res) => categoryController.updateCategory(req, res)
);

router.delete("/:id", isAuth, isAdmin,
    /*
        #swagger.tags = ['categories']
        #swagger.parameters['id'] = { description: 'Category ID', required: true }
    */
    (req, res) => categoryController.deleteCategory(req, res)
);

export default router;
