import { getDatabase } from '../database/db.js';
export function findAllUsers() {
    return getDatabase().prepare('SELECT * FROM psm_users ORDER BY user_id ASC').all();
}
export function findUserById(id) {
    return getDatabase().prepare('SELECT * FROM psm_users WHERE user_id = ?').get(id);
}
export function findUserByUsername(username) {
    return getDatabase().prepare('SELECT * FROM psm_users WHERE user_username = ?').get(username);
}
export function findUserByEmail(email) {
    return getDatabase().prepare('SELECT * FROM psm_users WHERE user_email = ?').get(email);
}
export function createUser(data) {
    const result = getDatabase()
        .prepare(`
      INSERT INTO psm_users
        (user_name, user_lastname, user_username, user_password, user_email)
      VALUES
        (@user_name, @user_lastname, @user_username, @user_password, @user_email)
    `)
        .run(data);
    return result.lastInsertRowid;
}
export function updateUser(id, data) {
    const fields = Object.keys(data)
        .map((key) => `${key} = @${key}`)
        .join(', ');
    const result = getDatabase()
        .prepare(`UPDATE psm_users SET ${fields} WHERE user_id = @id`)
        .run({ ...data, id });
    return result.changes;
}
export function updateUserPassword(id, hashedPassword) {
    const result = getDatabase()
        .prepare('UPDATE psm_users SET user_password = ? WHERE user_id = ?')
        .run(hashedPassword, id);
    return result.changes;
}
export function deactivateUser(id) {
    const result = getDatabase()
        .prepare(`UPDATE psm_users SET user_status = 'I' WHERE user_id = ?`)
        .run(id);
    return result.changes;
}
export function deleteUser(id) {
    const result = getDatabase().prepare('DELETE FROM psm_users WHERE user_id = ?').run(id);
    return result.changes;
}
export function countUsers() {
    const result = getDatabase().prepare('SELECT COUNT(*) as count FROM psm_users').get();
    return result.count;
}
export function deactivateFirstUser() {
    const result = getDatabase()
        .prepare(`UPDATE psm_users SET user_status = 'I' WHERE user_id = (SELECT user_id FROM psm_users ORDER BY user_id ASC LIMIT 1)`)
        .run();
    return result.changes;
}
export function findAdminUser() {
    return getDatabase()
        .prepare(`SELECT * FROM psm_users WHERE user_role = 'admin' LIMIT 1`)
        .get();
}
export function deactivateAdmin() {
    const result = getDatabase()
        .prepare(`UPDATE psm_users SET user_status = 'I' WHERE user_role = 'admin'`)
        .run();
    return result.changes;
}
