import { findAllParameters, findParameterById, createParameter, updateParameter, findDefaultParameter, setDefaultParameter, countParameters, } from '../repositories/parameter.repository.js';
// ─── Queries ──────────────────────────────────────────────────────────────────
export function getAllParameters() {
    return findAllParameters();
}
export function getParameterById(id) {
    return findParameterById(id);
}
// ─── Crear ────────────────────────────────────────────────────────────────────
export function registerParameter(dto) {
    const normalizedName = dto.par_name.trim();
    if (!normalizedName) {
        return { success: false, message: 'El nombre de la tarifa es obligatorio.' };
    }
    const parsedAmount = Number(dto.par_amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        return { success: false, message: 'El monto de la tarifa debe ser un numero positivo.' };
    }
    const nextDto = {
        ...dto,
        par_name: normalizedName,
        par_amount: parsedAmount.toString(),
        par_is_default: 0,
    };
    const id = createParameter(nextDto);
    if (dto.par_is_default) {
        const changes = setDefaultParameter(id);
        if (changes === 0) {
            return { success: false, message: 'No se pudo establecer la tarifa general.' };
        }
    }
    else {
        const currentDefault = findDefaultParameter();
        if (!currentDefault) {
            const changes = setDefaultParameter(id);
            if (changes === 0) {
                return { success: false, message: 'No se pudo crear una tarifa general valida.' };
            }
        }
    }
    return { success: true, id };
}
// ─── Actualizar ───────────────────────────────────────────────────────────────
export function editParameter(id, dto) {
    const existing = findParameterById(id);
    if (!existing) {
        return { success: false, message: 'Parámetro no encontrado.' };
    }
    const shouldSetDefault = dto.par_is_default === 1;
    const shouldUnsetDefault = dto.par_is_default === 0;
    if (shouldSetDefault) {
        delete dto.par_is_default;
    }
    if (shouldUnsetDefault && existing.par_is_default === 1) {
        return { success: false, message: 'Debe existir una tarifa general valida.' };
    }
    if (dto.par_name !== undefined) {
        const normalizedName = dto.par_name.trim();
        if (!normalizedName) {
            return { success: false, message: 'El nombre de la tarifa es obligatorio.' };
        }
        dto.par_name = normalizedName;
    }
    if (dto.par_amount !== undefined) {
        const parsedAmount = Number(dto.par_amount);
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            return { success: false, message: 'El monto de la tarifa debe ser un numero positivo.' };
        }
        dto.par_amount = parsedAmount.toString();
    }
    if (Object.keys(dto).length > 0) {
        updateParameter(id, dto);
    }
    if (shouldSetDefault) {
        const changes = setDefaultParameter(id);
        if (changes === 0) {
            return { success: false, message: 'No se pudo actualizar la tarifa general.' };
        }
    }
    const defaultAfterUpdate = findDefaultParameter();
    if (!defaultAfterUpdate) {
        return { success: false, message: 'Debe existir una tarifa general valida.' };
    }
    return { success: true };
}
export function getDefaultParameter() {
    return findDefaultParameter();
}
export function markParameterAsDefault(id) {
    const existing = findParameterById(id);
    if (!existing) {
        return { success: false, message: 'Parámetro no encontrado.' };
    }
    const changes = setDefaultParameter(id);
    if (changes === 0) {
        return { success: false, message: 'No se pudo actualizar la tarifa general.' };
    }
    return { success: true };
}
export function validateParameterDefaults() {
    const total = countParameters();
    if (total === 0) {
        return { success: false, message: 'No hay tarifas registradas.' };
    }
    const defaultTariff = findDefaultParameter();
    if (!defaultTariff) {
        return { success: false, message: 'Debe existir una tarifa general valida.' };
    }
    return { success: true };
}
