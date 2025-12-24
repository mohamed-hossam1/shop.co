export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
}

export interface UserContextType {
  user: UserProfile | null;
  updateUser: (newData: UserProfile) => void;
  resetUser: () => void;
  isLoading: boolean;
}
