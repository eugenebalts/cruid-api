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
  }

  private getUsers(req: Request, res: Response) {
    const allUsers = this.users.getAllUsers();

    res.status(200).json(allUsers);
  }
}
