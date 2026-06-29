import { getDatabase } from '../database/db.js';
import { Parameter, CreateParameterDto, UpdateParameterDto } from '../models/parameter.model.js';

export function findAllParameters(): Parameter[] {
  return getDatabase()
    .prepare('SELECT * FROM psm_parameters ORDER BY par_id ASC')
    .all() as Parameter[];
}

export function findParameterById(id: number): Parameter | undefined {
  return getDatabase().prepare('SELECT * FROM psm_parameters WHERE par_id = ?').get(id) as
    | Parameter
    | undefined;
}

export function createParameter(data: CreateParameterDto): number {
  const result = getDatabase()
    .prepare(
      `
      INSERT INTO psm_parameters (par_name, par_amount, par_is_default, version, par_quantity, par_tax)
      VALUES (@par_name, @par_amount, @par_is_default, @version, @par_amount, @par_amount)
    `
    )
    .run(data);

  return result.lastInsertRowid as number;
}

export function updateParameter(id: number, data: UpdateParameterDto): number {
  const fields = Object.keys(data)
    .map((key) => `${key} = @${key}`)
    .join(', ');

  const result = getDatabase()
    .prepare(`UPDATE psm_parameters SET ${fields} WHERE par_id = @id`)
    .run({ ...data, id });

  return result.changes;
}

export function findDefaultParameter(): Parameter | undefined {
  return getDatabase()
    .prepare('SELECT * FROM psm_parameters WHERE par_is_default = 1 LIMIT 1')
    .get() as Parameter | undefined;
}

export function setDefaultParameter(id: number): number {
  const db = getDatabase();
  const clearDefault = db.prepare(
    'UPDATE psm_parameters SET par_is_default = 0 WHERE par_is_default = 1'
  );
  const markDefault = db.prepare('UPDATE psm_parameters SET par_is_default = 1 WHERE par_id = ?');

  const transaction = db.transaction((targetId: number) => {
    clearDefault.run();
    return markDefault.run(targetId).changes;
  });

  return transaction(id);
}

export function countParameters(): number {
  const row = getDatabase().prepare('SELECT COUNT(*) AS total FROM psm_parameters').get() as
    | { total: number }
    | undefined;

  return row?.total ?? 0;
}
