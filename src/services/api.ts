import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import Users from '../users/users';

export default class Api {
  private server = express();
  private PORT = process.env.PORT || 4000;
  private users = new Users();

  constructor() {
    this.server.use(bodyParser.json());
    this.startServer();
    this.setupRoutes();
  }

  public startServer() {
    this.server.listen(this.PORT, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }

  private setupRoutes() {
    this.server.get('/', (req, res) => {
      res.send('Server has been started');
    });

    this.server.get('/users', (req, res) => this.getUsers(req, res));
    this.server.get('/users/:userId', (req, res) => this.getUserById(req, res));
    this.server.post('/users', (req, res) => this.createUser(req, res));
    this.server.put('/users/:userId', (req, res) => this.updateUser(req, res));
  }

  private getUsers(req: Request, res: Response) {
    const allUsers = this.users.getAllUsers();

    res.status(200).json(allUsers);
  }

  private getUserById(req: Request, res: Response) {
    const userId = req.params.userId;

    if (!isValidUUID(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = this.users.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  }

  private createUser(req: Request, res: Response) {
    try {
      const { username, age, hobbies } = req.body;

      if (!(username && age && hobbies)) {
        throw new Error(
          'Body request does not contain required fields (username, age, hobbies)',
        );
      }

      const newUser = this.users.createUser(username, age, hobbies);

      return res.status(200).json(newUser);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Something went wrong';

      res.status(400).json({ message: errorMsg });
    }
  }

  private updateUser(req: Request, res: Response) {
    const userId = req.params.userId;

    if (!isValidUUID(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const { username, age, hobbies } = req.body;

    try {
      const updatedUser = this.users.updateUser(userId, username, age, hobbies);

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return res.status(200).json(updatedUser);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Something went wrong';

      return res.status(404).json({ message: errorMsg });
    }
  }
}

function isValidUUID(uuid: string) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  return uuidRegex.test(uuid);
}
