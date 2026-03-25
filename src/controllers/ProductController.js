const { Product, Category, ProductImage, ProductOption, ProductCategory } = require('../database');
const { Op } = require('sequelize');

class ProductController {
  static async create(req, res) {
    try {
      const {
        name,
        description,
        price,
        discount_price,
        sku,
        stock_quantity,
        weight,
        dimensions,
        category_ids,
      } = req.body;

      if (!name || !price || !sku) {
        return res.status(400).json({
          success: false,
          message: 'Name, price, and SKU are required',
        });
      }

      const skuExists = await Product.findOne({ where: { sku } });
      if (skuExists) {
        return res.status(409).json({
          success: false,
          message: 'Product with this SKU already exists',
        });
      }

      const product = await Product.create({
        name,
        description,
        price,
        discount_price,
        sku,
        stock_quantity: stock_quantity || 0,
        weight,
        dimensions,
      });

      if (category_ids && Array.isArray(category_ids)) {
        const categories = await Category.findAll({
          where: { id: category_ids },
        });
        if (categories.length > 0) {
          await product.setCategories(categories);
        }
      }

      const productWithAssociations = await Product.findByPk(product.id, {
        include: [
          {
            association: 'categories',
            attributes: { exclude: ['created_at', 'updated_at'] },
            through: { attributes: [] },
          },
          {
            association: 'images',
            attributes: { exclude: ['created_at', 'updated_at'] },
          },
          {
            association: 'options',
            attributes: { exclude: ['created_at', 'updated_at'] },
          },
        ],
      });

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: productWithAssociations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: error.message,
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id, {
        include: [
          {
            association: 'categories',
            attributes: { exclude: ['created_at', 'updated_at'] },
            through: { attributes: [] },
          },
          {
            association: 'images',
            attributes: { exclude: ['created_at', 'updated_at'] },
          },
          {
            association: 'options',
            attributes: { exclude: ['created_at', 'updated_at'] },
          },
        ],
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching product',
        error: error.message,
      });
    }
  }

  static async getAll(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        isActive = true,
        categoryId,
        minPrice,
        maxPrice,
        sortBy = 'name',
        sortOrder = 'ASC',
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};
      const include = [];

      if (isActive !== undefined) {
        where.is_active = isActive === 'true';
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
      }

      if (categoryId) {
        include.push({
          association: 'categories',
          where: { id: categoryId },
          attributes: [],
          through: { attributes: [] },
        });
      }

      include.push({
        association: 'images',
        attributes: ['id', 'image_url', 'is_primary'],
      });

      const { count, rows } = await Product.findAndCountAll({
        where,
        include,
        limit: parseInt(limit),
        offset,
        order: [[sortBy, sortOrder.toUpperCase()]],
        distinct: true,
      });

      return res.status(200).json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching products',
        error: error.message,
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        discount_price,
        stock_quantity,
        weight,
        dimensions,
        is_active,
        category_ids,
      } = req.body;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      await product.update({
        name: name || product.name,
        description: description !== undefined ? description : product.description,
        price: price || product.price,
        discount_price: discount_price !== undefined ? discount_price : product.discount_price,
        stock_quantity: stock_quantity !== undefined ? stock_quantity : product.stock_quantity,
        weight: weight !== undefined ? weight : product.weight,
        dimensions: dimensions !== undefined ? dimensions : product.dimensions,
        is_active: is_active !== undefined ? is_active : product.is_active,
      });

      if (category_ids && Array.isArray(category_ids)) {
        const categories = await Category.findAll({
          where: { id: category_ids },
        });
        if (categories.length > 0) {
          await product.setCategories(categories);
        }
      }

      const updatedProduct = await Product.findByPk(id, {
        include: [
          {
            association: 'categories',
            attributes: { exclude: ['created_at', 'updated_at'] },
            through: { attributes: [] },
          },
          {
            association: 'images',
            attributes: { exclude: ['created_at', 'updated_at'] },
          },
          {
            association: 'options',
            attributes: { exclude: ['created_at', 'updated_at'] },
          },
        ],
      });

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating product',
        error: error.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      await product.destroy();

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting product',
        error: error.message,
      });
    }
  }
}

module.exports = ProductController;
