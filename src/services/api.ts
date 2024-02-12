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
}

function isValidUUID(uuid: string) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  return uuidRegex.test(uuid);
}
