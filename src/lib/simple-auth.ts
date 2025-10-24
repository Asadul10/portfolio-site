import { NextRequest } from 'next/server';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

// Simple in-memory user store
const users = new Map<string, User & { password: string }>();

// Initialize with default admin user (password: admin123)
const defaultAdmin = {
  id: 'admin-1',
  email: 'admin@asadul.dev',
  name: 'Admin User',
  role: 'admin' as const,
  password: 'admin123', // In production, use proper password hashing
};

users.set(defaultAdmin.id, defaultAdmin);

// Simple token generation (not cryptographically secure, for demo purposes)
function generateToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    timestamp: Date.now(),
  };
  
  // Simple base64 encoding (not secure for production)
  return btoa(JSON.stringify(payload));
}

function verifyToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token));
    
    // Check if token is less than 24 hours old
    const now = Date.now();
    const tokenAge = now - payload.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (tokenAge > maxAge) {
      return null;
    }
    
    const user = users.get(payload.userId);
    if (!user) {
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = Array.from(users.values()).find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export function generateAuthToken(user: User): string {
  return generateToken(user);
}

export function verifyAuthToken(token: string): User | null {
  return verifyToken(token);
}

export function getUserFromToken(request: NextRequest): User | null {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}

export function setAuthCookie(token: string): string {
  return `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`;
}

export function clearAuthCookie(): string {
  return `auth-token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}
