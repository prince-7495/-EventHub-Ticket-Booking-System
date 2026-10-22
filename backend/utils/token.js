import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'replace_with_a_long_random_secret';
const tokenExpiry = '24h';

export const generateToken = (attendeeId, role) => {
  try {
    const token = jwt.sign(
      { attendeeId, role },
      jwtSecret,
      { expiresIn: tokenExpiry }
    );
    return token;
  } catch (error) {
    console.error('Token generation error:', error.message);
    throw error;
  }
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};
