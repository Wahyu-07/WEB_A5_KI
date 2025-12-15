const db = require("../models");
const OrderItems = db.OrderItems;
const Products = db.Products;
const dbChangeLogController = require("./dbChangeLogController");

// ADD Item ke Order
exports.addItem = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { order_id, product_id, quantity, price } = req.body;

        const product = await Products.findByPk(product_id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const item = await OrderItems.create({ order_id, product_id, quantity, price });

        // Catat ke DBChangeLog
        await dbChangeLogController.logChange({
            table_name: "OrderItems",
            action: "CREATE",
            record_id: item.id,
            user_id,
            description: JSON.stringify(item)
        });

        res.json({ success: true, message: "Item added to order", data: item });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET Items (tidak dicatat)
exports.getItems = async (req, res) => {
    try {
        const data = await OrderItems.findAll({
            include: [{ model: Products, as: "product", attributes: ["name", "price"] }]
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE Item
exports.updateItem = async (req, res) => {
    try {
        const user_id = req.user.id;
        const item = await OrderItems.findByPk(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        const oldData = JSON.stringify(item);
        await item.update(req.body);

        await dbChangeLogController.logChange({
            table_name: "OrderItems",
            action: "UPDATE",
            record_id: item.id,
            user_id,
            description: `Sebelum: ${oldData}, Sesudah: ${JSON.stringify(item)}`
        });

        res.json({ success: true, message: "Item updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE Item
exports.deleteItem = async (req, res) => {
    try {
        const user_id = req.user.id;
        const item = await OrderItems.findByPk(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        const oldData = JSON.stringify(item);
        await item.destroy();

        await dbChangeLogController.logChange({
            table_name: "OrderItems",
            action: "DELETE",
            record_id: item.id,
            user_id,
            description: oldData
        });

        res.json({ success: true, message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
