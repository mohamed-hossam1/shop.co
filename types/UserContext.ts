import { User } from "./User";

export interface UserProfile extends Partial<User> {
  // Can add extra fields specific to the UI context if needed
}
