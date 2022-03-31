import { app } from "../app";
import http from "http";
import AppDataSource from "../configs/db.config";
import logger from "../lib/logger";
import webApp from "../web";

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

AppDataSource.initialize()
  .then(() => {
    logger.info("database", "Data Source has been initialized!");

    server.listen(PORT, () => {
      logger.info("server", `Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("database", err);
  });

webApp(app);
