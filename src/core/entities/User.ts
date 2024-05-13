export class User {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;

  constructor(
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
    role: string,
    id?: number
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.role = role;
  }
}
