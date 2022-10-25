import { Expose } from 'class-transformer';
import { Role } from '../enum/role.enum';

export class UserInfo {
  @Expose()
  id: number;

  @Expose()
  roles: Role;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  token?: string;
}
