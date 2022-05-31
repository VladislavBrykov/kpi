import express, { Application, Request, Response } from "express";
import routes from "./src/api/routes";
import { errorHandler } from "./src/exceptions/error.handler";
import cors from "cors";

const app: Application = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins: string[] = [
  'https://kpi-develop.convosight.com',
  'https://kpi-feature4.convosight.com',
  'https://kpi.convosight.com',
];

const corsOptions = {
  origin: function (origin: any, callback: (err: null | Error, opts: boolean) => void) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(null, true)
        /*
        Now all users can test without blocking. To limit by
        url, put in a block else next condition instead of callback
        callback(new Error('Not allowed by CORS'))
        */
    }
  }
}

app.get(
    "/api/healthcheck",
    async (req: Request, res: Response): Promise<Response> => {
      return res.status(200).send({
        message: "Ok",
      })
    }
);

app.use("/api", (req, res, next) => {
  console.log('first req.body:', req.body);
  next();
}, cors(corsOptions), routes);
app.use(errorHandler);
try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error) {
  console.error("Error occured");
}
