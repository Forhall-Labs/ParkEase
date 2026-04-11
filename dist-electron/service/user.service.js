import bcrypt from 'bcryptjs';
import { findUserByUsername, findUserByEmail, findAllUsers, findUserById, createUser, updateUser, updateUserPassword, deactivateUser, deleteUser, } from '../repositories/user.repository.js';
// ─── Helpers ──────────────────────────────────────────────────────────────────
function toSafeUser(user) {
    return {
        user_id: user.user_id,
        user_name: user.user_name,
        user_lastname: user.user_lastname,
        user_username: user.user_username,
        user_email: user.user_email,
        user_status: user.user_status,
        user_version: user.user_version,
    };
}
function isBcryptHash(password) {
    return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(password);
}
// ─── Queries ──────────────────────────────────────────────────────────────────
export function getAllUsers() {
    return findAllUsers().map(toSafeUser);
}
export function getUserById(id) {
    const user = findUserById(id);
    return user ? toSafeUser(user) : undefined;
}
// ─── Login ────────────────────────────────────────────────────────────────────
export function login(dto) {
    const user = findUserByUsername(dto.user_username);
    if (!user) {
        return { success: false, message: 'Credenciales inválidas.' };
    }
    if (user.user_status === 'I') {
        return { success: false, message: 'El usuario está inactivo.' };
    }
    if (isBcryptHash(user.user_password)) {
        const passwordMatch = bcrypt.compareSync(dto.user_password, user.user_password);
        if (!passwordMatch) {
            return { success: false, message: 'Credenciales inválidas.' };
        }
        return { success: true, user: toSafeUser(user) };
    }
    // Fallback temporal para usuarios legados con contraseña en texto plano.
    if (dto.user_password !== user.user_password) {
        return { success: false, message: 'Credenciales inválidas.' };
    }
    if (user.user_id != null) {
        const migratedHash = bcrypt.hashSync(dto.user_password, 10);
        updateUserPassword(user.user_id, migratedHash);
    }
    return { success: true, user: toSafeUser(user) };
}
// ─── Crear usuario ────────────────────────────────────────────────────────────
export function registerUser(dto) {
    // Validar duplicado de username
    const existingUsername = findUserByUsername(dto.user_username);
    if (existingUsername) {
        return { success: false, message: 'El nombre de usuario ya está en uso.' };
    }
    // Validar duplicado de email
    const existingEmail = findUserByEmail(dto.user_email);
    if (existingEmail) {
        return { success: false, message: 'El correo electrónico ya está registrado.' };
    }
    // Hashear contraseña
    const hashedPassword = bcrypt.hashSync(dto.user_password, 10);
    const id = createUser({ ...dto, user_password: hashedPassword });
    return { success: true, id };
}
// ─── Actualizar usuario ───────────────────────────────────────────────────────
export function editUser(id, dto) {
    const existing = findUserById(id);
    if (!existing) {
        return { success: false, message: 'Usuario no encontrado.' };
    }
    // Validar que el username no lo use otro usuario
    if (dto.user_username) {
        const byUsername = findUserByUsername(dto.user_username);
        if (byUsername && byUsername.user_id !== id) {
            return { success: false, message: 'El nombre de usuario ya está en uso.' };
        }
    }
    // Validar que el email no lo use otro usuario
    if (dto.user_email) {
        const byEmail = findUserByEmail(dto.user_email);
        if (byEmail && byEmail.user_id !== id) {
            return { success: false, message: 'El correo electrónico ya está registrado.' };
        }
    }
    updateUser(id, dto);
    return { success: true };
}
// ─── Cambiar contraseña ───────────────────────────────────────────────────────
export function changePassword(id, currentPassword, newPassword) {
    const user = findUserById(id);
    if (!user) {
        return { success: false, message: 'Usuario no encontrado.' };
    }
    const passwordMatch = bcrypt.compareSync(currentPassword, user.user_password);
    if (!passwordMatch) {
        return { success: false, message: 'La contraseña actual es incorrecta.' };
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    updateUserPassword(id, hashedPassword);
    return { success: true };
}
// ─── Desactivar / Eliminar ────────────────────────────────────────────────────
export function deactivateUserById(id) {
    const existing = findUserById(id);
    if (!existing) {
        return { success: false, message: 'Usuario no encontrado.' };
    }
    deactivateUser(id);
    return { success: true };
}
export function removeUser(id) {
    const existing = findUserById(id);
    if (!existing) {
        return { success: false, message: 'Usuario no encontrado.' };
    }
    deleteUser(id);
    return { success: true };
}
