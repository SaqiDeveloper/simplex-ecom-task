require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { unless } = require("express-unless");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require("./routes");
const { authenticateRoutes } = require("./config/unlessRoutes");
const { authenticate } = require("./middlewares/auth.middleware");
const requestLogger = require('./middlewares/requestLogger.js')
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/error/errorController");
const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(requestLogger)

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-Commerce API Documentation'
}));

app.get("/test", (req, res) => {
  return res.send("Server is running");
});

authenticate.unless = unless;
app.use(authenticate.unless(authenticateRoutes));


app.use(require('./middlewares/paginate').paginate)
app.use(routes);
  
app.all(/.*/, (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server!`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
