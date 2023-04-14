import SteamClient from "./steamClient.js";
import updateDiscordPost from "./updateDiscordPost.js";
import "dotenv/config";

const ADDRESS = process.env.SERVER_ADDRESS;
const PORT = process.env.SERVER_PORT;

const main = async () => {
  const steamClient = new SteamClient();
  const serverInfo = await steamClient.fetchServer(ADDRESS, PORT);

  await updateDiscordPost(serverInfo);
};

main();
