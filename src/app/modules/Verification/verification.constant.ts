export const VERIFICATION_TYPE = {
  'email-verify': 'email-verify',
  'password-reset': 'password-reset',
} as const;

export const VERIFICATION_STATUS = {
  pending: 'pending',
  verified: 'verified',
  expired: 'expired',
} as const;
