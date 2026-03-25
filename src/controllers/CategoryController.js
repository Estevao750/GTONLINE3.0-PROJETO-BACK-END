const { Category, Product, ProductCategory } = require('../database');
const { Op } = require('sequelize');

const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

class CategoryController {
  static async create(req, res) {
    try {
      const { name, description, image_url } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Category name is required',
        });
      }

      const slug = createSlug(name);

      const categoryExists = await Category.findOne({ where: { slug } });
      if (categoryExists) {
        return res.status(409).json({
          success: false,
          message: 'Category with this name already exists',
        });
      }

      const category = await Category.create({
        name,
        description,
        slug,
        image_url,
      });

      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating category',
        error: error.message,
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id, {
        include: {
          association: 'products',
          attributes: { exclude: ['created_at', 'updated_at'] },
          through: { attributes: [] },
        },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching category',
        error: error.message,
      });
    }
  }

  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, isActive = true } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (isActive !== undefined) {
        where.is_active = isActive === 'true';
      }

      const { count, rows } = await Category.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [['name', 'ASC']],
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
        message: 'Error fetching categories',
        error: error.message,
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, image_url, is_active } = req.body;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      let slug = category.slug;
      if (name && name !== category.name) {
        slug = createSlug(name);
        const slugExists = await Category.findOne({
          where: { slug, id: { [Op.ne]: id } },
        });
        if (slugExists) {
          return res.status(409).json({
            success: false,
            message: 'Category with this name already exists',
          });
        }
      }

      await category.update({
        name: name || category.name,
        description: description !== undefined ? description : category.description,
        image_url: image_url !== undefined ? image_url : category.image_url,
        slug,
        is_active: is_active !== undefined ? is_active : category.is_active,
      });

      return res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating category',
        error: error.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      await category.destroy();

      return res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting category',
        error: error.message,
      });
    }
  }
}

module.exports = CategoryController;
