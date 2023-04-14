import SteamClient from "./steamClient.js";
import updateDiscordPost from "./updateDiscordPost.js";
import "dotenv/config";
import http from "http";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;
const SERVER_PORT = process.env.SERVER_PORT;
const PORT = process.env.PORT || 3000;

const main = async () => {
  const steamClient = new SteamClient();
  const serverInfo = await steamClient.fetchServer(SERVER_ADDRESS, SERVER_PORT);

  await updateDiscordPost(serverInfo);
};

const server = http.createServer((_, res) => {
  main();

  res.end();
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🐒`);
});
