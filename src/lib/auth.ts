// Re-export simple auth functions to avoid external dependencies
export {
  authenticateUser,
  generateAuthToken as generateToken,
  verifyAuthToken as verifyToken,
  getUserFromToken,
  setAuthCookie,
  clearAuthCookie,
  type User
} from './simple-auth';
