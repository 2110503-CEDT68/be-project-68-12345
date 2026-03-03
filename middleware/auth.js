const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async(req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token|| token === 'null') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id);
    req.user = user;

    next();

  } catch (err) {
    console.error(err.message);

    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
}

exports.authorize = (...role) => {
    return (req, res, next)=> {
        if (!role.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                msg: `User role ${req.user.role} is not authorize to access this route`
            });
        }
        next();
    }
}