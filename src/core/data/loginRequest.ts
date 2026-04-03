export class LoginRequest
{
  public companyEmail!: string;
  public username!: string;
  public password!: string;

  constructor(init?: Partial<LoginRequest>)
  {
    Object.assign(this, init);
  }
}
