import http from "http";
import app from ".";
import * as dotenv from "dotenv";
dotenv.config();

http.globalAgent.maxSockets = 1000; // Increase max sockets to 1000

const port = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(
    `Server is running on port http://localhost:${port}\nwaiting for MongoDB connection...`
  );
});
