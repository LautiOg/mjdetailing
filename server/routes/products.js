const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const verifyToken = require('../middleware/auth');

// GET /api/products - Público: obtener productos con filtros
router.get('/', async (req, res) => {
  try {
    const { search, category, inStock } = req.query;
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'todos') {
      filter.category = category;
    }
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos', error: err.message });
  }
});

// POST /api/products - Admin: agregar producto
router.post('/', verifyToken, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear producto', error: err.message });
  }
});

// PUT /api/products/:id - Admin: editar producto completo
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar producto', error: err.message });
  }
});

// PATCH /api/products/:id/stock - Admin: ajustar stock (delta +/-)
router.patch('/:id/stock', verifyToken, async (req, res) => {
  try {
    const { delta } = req.body; // puede ser +1 o -1
    if (typeof delta !== 'number') {
      return res.status(400).json({ message: 'Se requiere un delta numérico' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const newStock = Math.max(0, product.stock + delta);
    product.stock = newStock;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error al ajustar stock', error: err.message });
  }
});

// DELETE /api/products/:id - Admin: eliminar producto
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar producto', error: err.message });
  }
});

module.exports = router;
