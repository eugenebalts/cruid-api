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

  public createUser(username: string, age: number, hobbies: string[]): User {
    const newUser: User = {
      id: uuidv4(),
      username,
      age,
      hobbies,
    };
    this.users.push(newUser);

    return newUser;
  }

  updateUser(
    userId: string,
    username: string,
    age: number,
    hobbies: string[],
  ): User | undefined {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        username,
        age,
        hobbies,
      };

      return this.users[userIndex];
    }

    return undefined;
  }

  deleteUser(userId: string): boolean {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return true;
    }
    return false;
  }
}
