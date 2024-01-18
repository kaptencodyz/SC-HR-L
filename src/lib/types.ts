import { User } from "next-auth";

export interface ExtendedUser extends User {
  isOAuth?: boolean;
  isTwoFactorEnabled?: boolean;
  handle?: string;
}
