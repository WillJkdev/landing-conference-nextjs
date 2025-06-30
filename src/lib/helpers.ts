import { User } from "next-auth";

export function sanitizeUser(user: User | null) {
  return {
    name: typeof user?.name === "string" ? user.name : "Admin",
    email: typeof user?.email === "string" ? user.email : "admin@admin.com",
  };
}
