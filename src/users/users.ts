interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export default class Users {
  private users: User[] = [];

  public getAllUsers(): User[] {
    return this.users;
  }
}
