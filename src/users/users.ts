import { v4 as uuidv4 } from 'uuid';

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

  public getUserById(userId: string): User | undefined {
    return this.users.find((user) => user.id === userId);
  }
}
