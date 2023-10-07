import type { Result } from '@ekwoka/rust-ts';
import { Err, Ok } from '@ekwoka/rust-ts';
import type { Struct, StructError} from 'superstruct';
import { validate } from 'superstruct';

export const tryValidate = <T, S>(value: unknown, struct: Struct<T, S>, options?: {
    coerce?: boolean;
    mask?: boolean;
    message?: string;
}): Result<T, StructError> => {
    const [error, result] = validate(value, struct, options);
    if (error) return new Err(error);
    return new Ok(result);
}
