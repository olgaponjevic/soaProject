export const USER_ROLE = {
  Tourist: 0,
  Guide: 1,
  Administrator: 2,
} as const;

export type UserRoleValue = typeof USER_ROLE[keyof typeof USER_ROLE];