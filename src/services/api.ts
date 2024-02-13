import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import Users from '../users/users';

export default class Api {
  public server = express();
  private PORT = process.env.PORT || 4000;
  private users = new Users();
  private SERVER_ERROR_MESSAGE = 'Internal Server Error';

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
    this.server.delete('/users/:userId', (req, res) =>
      this.deleteUser(req, res),
    );
  }

  private getUsers(req: Request, res: Response) {
    try {
      const allUsers = this.users.getAllUsers();

      return res.status(200).json(allUsers);
    } catch (err) {
      return res.status(500).json({ message: this.SERVER_ERROR_MESSAGE });
    }
  }

  private getUserById(req: Request, res: Response) {
    const userId = req.params.userId;

    if (!isValidUUID(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
      const user = this.users.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (_) {
      return res.status(500).json({ message: this.SERVER_ERROR_MESSAGE });
    }
  }

  private createUser(req: Request, res: Response) {
    try {
      const { username, age, hobbies } = req.body;

      if (!(username && age && hobbies)) {
        return res.status(400).json({
          message:
            'Body request does not contain required fields (username, age, hobbies)',
        });
      }

      const newUser = this.users.createUser(username, age, hobbies);

      return res.status(200).json(newUser);
    } catch (_) {
      return res.status(500).json({ message: this.SERVER_ERROR_MESSAGE });
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
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(updatedUser);
    } catch (_) {
      return res.status(500).json({ message: this.SERVER_ERROR_MESSAGE });
    }
  }

  private deleteUser(req: Request, res: Response) {
    const userId = req.params.userId;

    if (!isValidUUID(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
      const isUserDelete = this.users.deleteUser(userId);

      if (!isUserDelete) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res
        .status(200)
        .json({ message: `User with id ${userId} has deleted` })
        .send();
    } catch (_) {
      return res.status(500).json({ message: this.SERVER_ERROR_MESSAGE });
    }
  }
}

function isValidUUID(uuid: string) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  return uuidRegex.test(uuid);
}
