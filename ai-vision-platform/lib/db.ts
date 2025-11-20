import { User } from './types';

// In-memory user storage (in production, use a database)
const users: User[] = [];

export function createUser(name: string, email: string, hashedPassword: string): User {
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    password: hashedPassword,
  };
  users.push(user);
  return user;
}

export function findUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}
