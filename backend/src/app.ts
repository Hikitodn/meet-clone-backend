import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import http from "http";

dotenv.config();
export const app = express();

const server = http.createServer(app);

// Config environment variables
const {
  SES_NAME = "sid",
  SES_SECRET = "secret",
  NODE_ENV = "development",
} = process.env;
const HTTP_ONLY: boolean = process.env.HTTP_ONLY ? true : false;
const SES_LIFETIME: number = process.env.SES_LIFETIME
  ? parseInt(process.env.SES_LIFETIME)
  : 1000 * 60 * 60 * 2;
const IN_PRODUCT = NODE_ENV === "production" ? true : false;
// Normal express config defaults
if (NODE_ENV === "development") app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(
  session({
    name: SES_NAME,
    secret: SES_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: HTTP_ONLY,
      maxAge: SES_LIFETIME,
      secure: IN_PRODUCT,
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.static(path.join(__dirname, "../public")));
