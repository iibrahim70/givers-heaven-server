// User roles for the users.
export const USER_ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  'SUPER-ADMIN': 'SUPER-ADMIN',
} as const;

// User account statuses for the users.
export const USER_STATUS = {
  active: 'active',
  inactive: 'inactive',
  blocked: 'blocked',
} as const;

// Gender options for users.
export const GENDER = {
  male: 'male',
  female: 'female',
  others: 'others',
} as const;
