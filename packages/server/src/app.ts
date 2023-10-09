import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';



import { checkJWT, handleUserCreation } from './middleware/auth';
import { globalErrorHandler } from './middleware/errorHandler';
import rootRouter from './root';

const app = express();


app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev', { skip: () => process.env.NODE_ENV === 'test' }));

/* HandleUserCreation must go after checkAuth */
app.use(checkJWT);
app.use(handleUserCreation);

app.get('/', (_req, res) => {
  res.status(200).json({ message: "Welcome to HopCC's API!" });
});

app.use('/', rootRouter);
app.use(globalErrorHandler);

export default app;
