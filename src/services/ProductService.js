const { Product, ProductImage, ProductOption, Category } = require('../database');

class ProductService {
  static async getProductWithDetails(productId) {
    try {
      return await Product.findByPk(productId, {
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
    } catch (error) {
      throw new Error(`Error fetching product details: ${error.message}`);
    }
  }

  static async checkStock(productId, quantity) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return { available: false, message: 'Product not found' };
      }
      if (product.stock_quantity < quantity) {
        return {
          available: false,
          message: `Insufficient stock. Available: ${product.stock_quantity}`,
          availableQuantity: product.stock_quantity,
        };
      }
      return { available: true, message: 'Stock available' };
    } catch (error) {
      throw new Error(`Error checking stock: ${error.message}`);
    }
  }

  static async updateStock(productId, quantityChange) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const newQuantity = product.stock_quantity + quantityChange;
      if (newQuantity < 0) {
        throw new Error('Stock quantity cannot be negative');
      }

      await product.update({ stock_quantity: newQuantity });
      return product;
    } catch (error) {
      throw new Error(`Error updating stock: ${error.message}`);
    }
  }

  static async addProductImage(productId, imageUrl, altText = '', isPrimary = false) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (isPrimary) {
        await ProductImage.update(
          { is_primary: false },
          { where: { product_id: productId } }
        );
      }

      return await ProductImage.create({
        product_id: productId,
        image_url: imageUrl,
        alt_text: altText,
        is_primary: isPrimary,
      });
    } catch (error) {
      throw new Error(`Error adding product image: ${error.message}`);
    }
  }

  static async addProductOption(productId, optionName, optionValue, additionalPrice = 0) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      return await ProductOption.create({
        product_id: productId,
        option_name: optionName,
        option_value: optionValue,
        additional_price: additionalPrice,
      });
    } catch (error) {
      throw new Error(`Error adding product option: ${error.message}`);
    }
  }

  static async getProductsByCategory(categoryId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      return await Product.findAndCountAll({
        include: {
          association: 'categories',
          where: { id: categoryId },
          attributes: [],
          through: { attributes: [] },
        },
        limit: parseInt(limit),
        offset,
        order: [['name', 'ASC']],
      });
    } catch (error) {
      throw new Error(`Error fetching products by category: ${error.message}`);
    }
  }

  static async searchProducts(searchTerm, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const { Op } = require('sequelize');

      return await Product.findAndCountAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${searchTerm}%` } },
            { description: { [Op.like]: `%${searchTerm}%` } },
            { sku: { [Op.like]: `%${searchTerm}%` } },
          ],
        },
        limit: parseInt(limit),
        offset,
        order: [['name', 'ASC']],
      });
    } catch (error) {
      throw new Error(`Error searching products: ${error.message}`);
    }
  }

  static calculateFinalPrice(price, discountPrice) {
    if (discountPrice && discountPrice > 0 && discountPrice < price) {
      return discountPrice;
    }
    return price;
  }

  static calculateDiscount(price, discountPrice) {
    if (!discountPrice || discountPrice >= price) {
      return 0;
    }
    return Math.round(((price - discountPrice) / price) * 100);
  }
}

module.exports = ProductService;
