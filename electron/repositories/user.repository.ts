import { getDatabase } from '../database/db.js';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model.js';

export function findAllUsers(): User[] {
  return getDatabase().prepare('SELECT * FROM psm_users ORDER BY user_id ASC').all() as User[];
}

export function findUserById(id: number): User | undefined {
  return getDatabase().prepare('SELECT * FROM psm_users WHERE user_id = ?').get(id) as
    | User
    | undefined;
}

export function findUserByUsername(username: string): User | undefined {
  return getDatabase().prepare('SELECT * FROM psm_users WHERE user_username = ?').get(username) as
    | User
    | undefined;
}

export function findUserByEmail(email: string): User | undefined {
  return getDatabase().prepare('SELECT * FROM psm_users WHERE user_email = ?').get(email) as
    | User
    | undefined;
}

export function createUser(data: CreateUserDto & { user_password: string }): number {
  const result = getDatabase()
    .prepare(
      `
      INSERT INTO psm_users
        (user_name, user_lastname, user_username, user_password, user_email)
      VALUES
        (@user_name, @user_lastname, @user_username, @user_password, @user_email)
    `
    )
    .run(data);

  return result.lastInsertRowid as number;
}

export function updateUser(id: number, data: UpdateUserDto): number {
  const fields = Object.keys(data)
    .map((key) => `${key} = @${key}`)
    .join(', ');

  const result = getDatabase()
    .prepare(`UPDATE psm_users SET ${fields} WHERE user_id = @id`)
    .run({ ...data, id });

  return result.changes;
}

export function updateUserPassword(id: number, hashedPassword: string): number {
  const result = getDatabase()
    .prepare('UPDATE psm_users SET user_password = ? WHERE user_id = ?')
    .run(hashedPassword, id);

  return result.changes;
}

export function deactivateUser(id: number): number {
  const result = getDatabase()
    .prepare(`UPDATE psm_users SET user_status = 'I' WHERE user_id = ?`)
    .run(id);

  return result.changes;
}

export function deleteUser(id: number): number {
  const result = getDatabase().prepare('DELETE FROM psm_users WHERE user_id = ?').run(id);

  return result.changes;
}

export function findAdminUser(): User | undefined {
  return getDatabase()
    .prepare(`SELECT * FROM psm_users WHERE user_role = 'admin' LIMIT 1`)
    .get() as User | undefined;
}

export function deactivateAdmin(): number {
  const result = getDatabase()
    .prepare(`UPDATE psm_users SET user_status = 'I' WHERE user_role = 'admin'`)
    .run();

  return result.changes;
}
