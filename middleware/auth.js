const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - ensures user authentication and transaction confidentiality
exports.protect = async(req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token || token === 'null') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route - Please login'
    });
  }

  try {
    // Verify token and decode user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user from database (excluding password for security)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found - Token invalid'
      });
    }
    
    // Attach user to request object for use in routes
    req.user = user;

    next();

  } catch (err) {
    console.error('Authentication error:', err.message);

    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route - Invalid token'
    });
  }
}

// Role-based authorization middleware
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    }
}