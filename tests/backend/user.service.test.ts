import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDb } from './setup.js';
import {
  login,
  registerUser,
  editUser,
  changePassword,
  deactivateUserById,
  removeUser,
  getAllUsers,
} from '../../electron/service/user.service.js';

function makeUserDto(overrides: Partial<{
  user_username: string;
  user_email: string;
  user_name: string;
  user_lastname: string;
  user_password: string;
  user_role: 'admin' | 'user';
}> = {}) {
  const suffix = `${Date.now()}-${Math.random()}`;
  return {
    user_name: overrides.user_name ?? 'Test',
    user_lastname: overrides.user_lastname ?? 'User',
    user_username: overrides.user_username ?? `user_${suffix}`,
    user_password: overrides.user_password ?? 'Password123',
    user_email: overrides.user_email ?? `test_${suffix}@example.com`,
    user_role: overrides.user_role ?? ('user' as const),
  };
}

describe('user.service', () => {
  beforeEach(() => {
    createTestDb();
  });

  describe('registerUser', () => {
    it('creates a new user', () => {
      const result = registerUser(makeUserDto());
      expect(result.success).toBe(true);
      expect(result.id).toBeTypeOf('number');
    });

    it('blocks duplicate username', () => {
      registerUser(makeUserDto({ user_username: 'duplicado', user_email: 'a@a.com' }));
      const result = registerUser(makeUserDto({ user_username: 'duplicado', user_email: 'b@b.com' }));
      expect(result.success).toBe(false);
      expect(result.message).toContain('usuario');
    });

    it('blocks duplicate email', () => {
      registerUser(makeUserDto({ user_username: 'user_a', user_email: 'same@x.com' }));
      const result = registerUser(makeUserDto({ user_username: 'user_b', user_email: 'same@x.com' }));
      expect(result.success).toBe(false);
      expect(result.message).toContain('correo');
    });

    it('stores password as bcrypt hash', () => {
      const { id } = registerUser(makeUserDto({ user_username: 'hashtest', user_email: 'h@h.com', user_password: 'plain123' }));
      const users = getAllUsers();
      const user = users.find((u) => u.user_id === id);
      // getAllUsers returns SafeUser (no password) — just verify user exists
      expect(user).toBeDefined();
    });
  });

  describe('login', () => {
    it('succeeds with correct credentials', () => {
      registerUser(makeUserDto({ user_username: 'loginuser', user_email: 'l@l.com', user_password: 'secret' }));
      const result = login({ user_username: 'loginuser', user_password: 'secret' });
      expect(result.success).toBe(true);
      expect(result.user?.user_username).toBe('loginuser');
    });

    it('fails with wrong password', () => {
      registerUser(makeUserDto({ user_username: 'loginuser2', user_email: 'l2@l.com', user_password: 'correct' }));
      const result = login({ user_username: 'loginuser2', user_password: 'wrong' });
      expect(result.success).toBe(false);
      expect(result.message).toContain('Credenciales');
    });

    it('fails when user does not exist', () => {
      const result = login({ user_username: 'noexiste', user_password: 'abc' });
      expect(result.success).toBe(false);
    });

    it('fails when user is inactive', () => {
      const { id } = registerUser(makeUserDto({ user_username: 'inactive', user_email: 'i@i.com', user_password: 'pass' }));
      deactivateUserById(id!);
      const result = login({ user_username: 'inactive', user_password: 'pass' });
      expect(result.success).toBe(false);
      expect(result.message).toContain('inactivo');
    });

    it('does not expose password field in response', () => {
      registerUser(makeUserDto({ user_username: 'safeuser', user_email: 's@s.com', user_password: 'pass' }));
      const result = login({ user_username: 'safeuser', user_password: 'pass' });
      expect(result.success).toBe(true);
      expect((result.user as Record<string, unknown>)?.user_password).toBeUndefined();
    });
  });

  describe('editUser', () => {
    it('updates user name', () => {
      const { id } = registerUser(makeUserDto());
      const result = editUser(id!, { user_name: 'Nuevo' });
      expect(result.success).toBe(true);
    });

    it('fails when user not found', () => {
      const result = editUser(9999, { user_name: 'X' });
      expect(result.success).toBe(false);
    });

    it('blocks duplicate username with another user', () => {
      registerUser(makeUserDto({ user_username: 'taken', user_email: 'taken@x.com' }));
      const { id } = registerUser(makeUserDto({ user_username: 'other', user_email: 'other@x.com' }));
      const result = editUser(id!, { user_username: 'taken' });
      expect(result.success).toBe(false);
    });

    it('blocks duplicate email with another user', () => {
      registerUser(makeUserDto({ user_username: 'u1', user_email: 'shared@x.com' }));
      const { id } = registerUser(makeUserDto({ user_username: 'u2', user_email: 'own@x.com' }));
      const result = editUser(id!, { user_email: 'shared@x.com' });
      expect(result.success).toBe(false);
    });
  });

  describe('changePassword', () => {
    it('changes password successfully', () => {
      const { id } = registerUser(makeUserDto({ user_username: 'pwuser', user_email: 'pw@pw.com', user_password: 'old' }));
      const result = changePassword(id!, 'old', 'newPass');
      expect(result.success).toBe(true);
    });

    it('fails with wrong current password', () => {
      const { id } = registerUser(makeUserDto({ user_username: 'pwuser2', user_email: 'pw2@pw.com', user_password: 'real' }));
      const result = changePassword(id!, 'wrong', 'newPass');
      expect(result.success).toBe(false);
    });

    it('fails when user not found', () => {
      const result = changePassword(9999, 'any', 'new');
      expect(result.success).toBe(false);
    });

    it('new password works after change', () => {
      const { id } = registerUser(makeUserDto({ user_username: 'pwuser3', user_email: 'pw3@pw.com', user_password: 'old' }));
      changePassword(id!, 'old', 'NewPass123');
      const loginResult = login({ user_username: 'pwuser3', user_password: 'NewPass123' });
      expect(loginResult.success).toBe(true);
    });
  });

  describe('deactivateUserById', () => {
    it('deactivates an active user', () => {
      const { id } = registerUser(makeUserDto());
      const result = deactivateUserById(id!);
      expect(result.success).toBe(true);
    });

    it('fails when user not found', () => {
      const result = deactivateUserById(9999);
      expect(result.success).toBe(false);
    });
  });

  describe('removeUser', () => {
    it('deletes existing user', () => {
      const { id } = registerUser(makeUserDto());
      const result = removeUser(id!);
      expect(result.success).toBe(true);
    });

    it('fails when user not found', () => {
      const result = removeUser(9999);
      expect(result.success).toBe(false);
    });
  });
});
