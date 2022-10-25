import { Role } from '../../src/enum/role.enum';
import { Expose } from 'class-transformer';

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
