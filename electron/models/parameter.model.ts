export interface Parameter {
  par_id?: number;
  par_name: string;
  par_amount: string;
  par_is_default: number;
  version: number;
}

export type CreateParameterDto = Omit<Parameter, 'par_id'>;

export type UpdateParameterDto = Partial<Omit<Parameter, 'par_id'>>;
