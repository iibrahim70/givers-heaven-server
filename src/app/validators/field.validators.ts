/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import { ApiError } from '../errors/ApiError';

export const validateRequiredFields = (
  fields: { name: string; value: any }[],
): void => {
  for (const field of fields) {
    if (
      field?.value === undefined ||
      field?.value === null ||
      (typeof field?.value === 'string' && field?.value.trim() === '')
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, `${field?.name} is required.`);
    }
  }
};
