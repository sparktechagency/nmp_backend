

export const UserRole = {
    user: 'user',
    super_admin: 'super_admin',
    admin: "admin"
} as const;


export const UserSearchFields = [
    "fullName",
    "email",
    "phone"
]

export const UserValidFields: string[] = [
  "searchTerm",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "status",
  "gender"
];