export interface BusinessSocial {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  [key: string]: string | undefined;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  slogan: string | null;
  primary_color: string | null;
  email: string | null;
  social: BusinessSocial;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessDTO {
  name: string;
  slug: string;
  logo?: string;
  slogan?: string;
  primary_color?: string;
  email?: string;
  social?: BusinessSocial;
  address?: string;
}

export interface UpdateBusinessDTO extends Partial<Omit<Business, 'id' | 'created_at' | 'updated_at' | 'is_active'>> {}
