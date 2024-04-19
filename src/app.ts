import express, {NextFunction, Request, Response} from 'express';

export default function createServer(): express.Application {
    const expressApp = express();
  
    expressApp.get('/health', (_, res) => res.sendStatus(200));

    expressApp.get('/count', (_, res: Response) => {console.log('TODO: send the count'); res.send('To be implemented');});

    expressApp.post('/count', (_, res) => console.log('TODO: register data'));


    expressApp.use('*', (req: Request, res: Response, next: NextFunction) => {
      try {
        const error = new Error('You requested an endpoint that does not exist.');
        res.sendStatus(404);
        throw error;
      } catch (err) {
        next(err);
      }
    })

    return expressApp;
}
