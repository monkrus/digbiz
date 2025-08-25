export type VisibilityMap = {
  name: boolean;
  title: boolean;
  company: boolean;
  phone: boolean;
  email: boolean;
  website: boolean;
  twitter?: boolean;
  linkedin?: boolean;
  github?: boolean;
  avatarUrl?: boolean;
  logoUrl?: boolean;
};

export type UserProfile = {
  uid: string;
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  email: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  avatarUrl?: string;
  logoUrl?: string;
  visibility: VisibilityMap;
  updatedAt?: number; // Date.now()
};
