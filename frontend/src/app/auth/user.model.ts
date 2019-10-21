export class User {
  constructor(
    public email: string,
    public id: string,
    public firstName: string,
    public lastName: string,
    private seller: boolean,
    private active: boolean
  ) {}
}
