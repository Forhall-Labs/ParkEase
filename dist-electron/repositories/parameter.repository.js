import { getDatabase } from '../database/db.js';
export function findAllParameters() {
    return getDatabase()
        .prepare('SELECT * FROM psm_parameters ORDER BY par_id ASC')
        .all();
}
export function findParameterById(id) {
    return getDatabase().prepare('SELECT * FROM psm_parameters WHERE par_id = ?').get(id);
}
export function createParameter(data) {
    const result = getDatabase()
        .prepare(`
      INSERT INTO psm_parameters (par_name, par_amount, par_is_default, version, par_quantity, par_tax)
      VALUES (@par_name, @par_amount, @par_is_default, @version, @par_amount, @par_amount)
    `)
        .run(data);
    return result.lastInsertRowid;
}
export function updateParameter(id, data) {
    const fields = Object.keys(data)
        .map((key) => `${key} = @${key}`)
        .join(', ');
    const result = getDatabase()
        .prepare(`UPDATE psm_parameters SET ${fields} WHERE par_id = @id`)
        .run({ ...data, id });
    return result.changes;
}
export function findDefaultParameter() {
    return getDatabase()
        .prepare('SELECT * FROM psm_parameters WHERE par_is_default = 1 LIMIT 1')
        .get();
}
export function setDefaultParameter(id) {
    const db = getDatabase();
    const clearDefault = db.prepare('UPDATE psm_parameters SET par_is_default = 0 WHERE par_is_default = 1');
    const markDefault = db.prepare('UPDATE psm_parameters SET par_is_default = 1 WHERE par_id = ?');
    const transaction = db.transaction((targetId) => {
        clearDefault.run();
        return markDefault.run(targetId).changes;
    });
    return transaction(id);
}
export function countParameters() {
    const row = getDatabase().prepare('SELECT COUNT(*) AS total FROM psm_parameters').get();
    return row?.total ?? 0;
}
