import httpStatus from 'http-status';
import { ApiError } from '../errors/ApiError';
import { TVerificationType } from '../modules/Verification/verification.interface';
import { VERIFICATION_TYPE } from '../modules/Verification/verification.constant';

const supportedVerificationTypes = [
  VERIFICATION_TYPE['email-verify'],
  VERIFICATION_TYPE['password-reset'],
];

const ensureSupportedVerificationType = (
  verificationType: TVerificationType,
) => {
  if (!supportedVerificationTypes.includes(verificationType)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Unsupported verification type provided.',
    );
  }
};

export const VerificationValidators = {
  ensureSupportedVerificationType,
};
