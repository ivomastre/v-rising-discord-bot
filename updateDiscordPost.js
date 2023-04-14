import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import "dotenv/config";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_BOT_ID = process.env.DISCORD_BOT_ID;
const DISCORD_BOT_CHANNEL_ID = process.env.DISCORD_BOT_CHANNEL_ID;

const chunckArray = (array, size) => {
  const chunkedArray = [];

  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size));
  }

  return chunkedArray;
};

const createContent = ({
  players,
  playerCount,
  serverName,
  maxPlayers,
  daysRunning,
}) => {
  const embed = new EmbedBuilder()
    .setTitle(serverName)
    .setDescription(`**${playerCount}** / **${maxPlayers}** players online`)
    .setFooter({ text: `Days running: ${daysRunning}` })

    .setColor(0x00ff00);

  embed.addFields(
    ...chunckArray(players, 20).map((chunckedPlayers) => ({
      name: "Online players",
      value: chunckedPlayers.join("\n"),
      inline: true,
    }))
  );

  return embed;
};

const updateDiscordPost = async (props) => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  await client.login(DISCORD_TOKEN);

  const channel = await client.channels.fetch(DISCORD_BOT_CHANNEL_ID);

  if (!channel) {
    console.log("Channel not found");
    return;
  }

  const messages = await channel.messages.fetch();

  const messagesToDelete = messages.filter(
    (message) => message.author.id === DISCORD_BOT_ID
  );

  if (messagesToDelete.size > 0) {
    await channel.bulkDelete(messagesToDelete);
  }

  await channel.send({ embeds: [createContent(props)] });

  client.destroy();
};

export default updateDiscordPost;
