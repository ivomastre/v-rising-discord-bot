import SteamClient from "./steamClient.js";

const ADDRESS = "131.221.200.19";
const PORT = 9877;

const main = async () => {
  const steamClient = new SteamClient();
  const serverInfo = await steamClient.getServerInfo(ADDRESS, PORT);
  console.log(serverInfo);

  const playerInfo = await steamClient.getPlayerInfo(ADDRESS, PORT);
  console.log(playerInfo);

  const rules = await steamClient.getRules(ADDRESS, PORT);
  console.log(rules);
};

main();
