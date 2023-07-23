export interface UpdateUserDto {
  avatar?: string;
  fullname?: string;
  username?: string;
  email?: string;
  admin?: boolean;
  refreshToken?: string;
}
