const { User } = require('../database');
const { generateToken } = require('../utils/jwt');

class UserController {
  static async create(req, res) {
    try {
      const { name, email, password, phone, address, city, state, zip_code } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required',
        });
      }

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered',
        });
      }

      const user = await User.create({
        name,
        email,
        password,
        phone,
        address,
        city,
        state,
        zip_code,
      });

      const token = generateToken(user.id, user.role);

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          city: user.city,
          state: user.state,
          zip_code: user.zip_code,
          role: user.role,
          token,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating user',
        error: error.message,
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user',
        error: error.message,
      });
    }
  }

  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, role } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (role) {
        where.role = role;
      }

      const { count, rows } = await User.findAndCountAll({
        where,
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset,
        order: [['created_at', 'DESC']],
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
        message: 'Error fetching users',
        error: error.message,
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, phone, address, city, state, zip_code } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (req.userId !== id && req.userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this user',
        });
      }

      await user.update({
        name: name || user.name,
        phone: phone || user.phone,
        address: address || user.address,
        city: city || user.city,
        state: state || user.state,
        zip_code: zip_code || user.zip_code,
      });

      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          city: user.city,
          state: user.state,
          zip_code: user.zip_code,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating user',
        error: error.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (req.userId !== id && req.userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this user',
        });
      }

      await user.destroy();

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error: error.message,
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const passwordMatch = await user.validatePassword(password);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const token = generateToken(user.id, user.role);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error during login',
        error: error.message,
      });
    }
  }
}

module.exports = UserController;
