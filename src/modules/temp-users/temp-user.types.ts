export interface TempUser {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTempUserDTO {
  name: string;
  phone: string;
  address?: string;
}

export interface UpdateTempUserDTO extends Partial<Omit<TempUser, 'id' | 'created_at' | 'updated_at'>> {}

export interface SearchTempUsersQuery {
  search?: string; // Search by name or phone (partial match)
  page?: number;
  limit?: number;
}

export interface TempUserListResponse {
  data: TempUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
