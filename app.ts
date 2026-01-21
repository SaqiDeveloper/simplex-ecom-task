import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { unless } from 'express-unless';
import swaggerUi from 'swagger-ui-express';
// @ts-ignore - Swagger config is JS file
import swaggerSpec from './config/swagger';
import routes from './routes';
import { authenticateRoutes } from './config/unlessRoutes';
import { authenticate } from './middlewares/auth.middleware';
import requestLogger from './middlewares/requestLogger';
import { CustomError } from './utils/CustomError';
import globalErrorHandler from './controllers/error/errorController';

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(requestLogger);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-Commerce API Documentation'
}));

app.get("/test", (_req: Request, res: Response) => {
  return res.send("Server is running");
});

(authenticate as any).unless = unless;
app.use((authenticate as any).unless(authenticateRoutes));

app.use(require('./middlewares/paginate').paginate);
app.use(routes);

app.all(/.*/, (req: Request, _res: Response, next: NextFunction) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server!`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

export default app;

