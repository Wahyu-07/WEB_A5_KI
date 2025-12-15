const db = require("../models");
const Products = db.Products;
const dbChangeLogController = require("./dbChangeLogController");

// CREATE Product
exports.createProduct = async (req, res) => {
    try {
        const user_id = req.user.id; // pastikan req.user tersedia dari middleware verifyToken
        const product = await Products.create(req.body);

        // Catat perubahan
        await dbChangeLogController.logChange({
            table_name: "Products",
            action: "CREATE",
            record_id: product.id,
            user_id,
            description: JSON.stringify(product)
        });

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// READ all
exports.getProducts = async (req, res) => {
    try {
        const data = await Products.findAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// READ by ID
exports.getProductById = async (req, res) => {
    try {
        const data = await Products.findByPk(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE Product
exports.updateProduct = async (req, res) => {
    try {
        const user_id = req.user.id;
        const product = await Products.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        const oldData = JSON.stringify(product);

        await product.update(req.body);

        await dbChangeLogController.logChange({
            table_name: "Products",
            action: "UPDATE",
            record_id: product.id,
            user_id,
            description: `Sebelum: ${oldData}, Sesudah: ${JSON.stringify(product)}`
        });

        res.json({ success: true, message: "Product updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE Product
exports.deleteProduct = async (req, res) => {
    try {
        const user_id = req.user.id;
        const product = await Products.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        const oldData = JSON.stringify(product);

        await product.destroy();

        await dbChangeLogController.logChange({
            table_name: "Products",
            action: "DELETE",
            record_id: product.id,
            user_id,
            description: oldData
        });

        res.json({ success: true, message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
