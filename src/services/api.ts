import express from 'express';
import bodyParser from 'body-parser';

export default class Api {
  private server = express();
  private PORT = process.env.PORT || 4000;

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
  }
}
