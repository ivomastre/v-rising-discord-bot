import Socket from "./socket.js";
import {
  getServerInfoSanitizer,
  getPlayerInfoSanitizer,
  getRulesSanitizer,
} from "./utils/sanitizer.js";

class SteamClient {
  constructor() {
    this.socket = new Socket();
  }

  async getServerInfo(ipAddress, port) {
    const packet = Buffer.concat([
      Buffer.from([0xff, 0xff, 0xff, 0xff]),
      Buffer.from([0x54]),
      Buffer.from("Source Engine Query", "ascii"),
      Buffer.from([0x00]),
    ]);

    const challengeResponse = await this.socket.send(packet, port, ipAddress);

    const challengePayload = challengeResponse.slice(5);

    const serverInfo = await this.socket.send(
      Buffer.concat([packet, challengePayload]),
      port,
      ipAddress
    );

    return getServerInfoSanitizer(serverInfo);
  }

  async getPlayerInfo(ipAddress, port) {
    const basePacket = Buffer.concat([
      Buffer.from([0xff, 0xff, 0xff, 0xff]),
      Buffer.from([0x55]),
    ]);
    const packet = Buffer.concat([
      basePacket,
      Buffer.from([0xff, 0xff, 0xff, 0xff]),
    ]);

    const challengeResponse = await this.socket.send(packet, port, ipAddress);
    const challengePayload = challengeResponse.slice(5);

    const playerInfo = await this.socket.send(
      Buffer.concat([basePacket, challengePayload]),
      port,
      ipAddress
    );

    return getPlayerInfoSanitizer(playerInfo);
  }

  async getRules(ipAddress, port) {
    const basePacket = Buffer.concat([
      Buffer.from([0xff, 0xff, 0xff, 0xff]),
      Buffer.from([0x56]),
    ]);
    const packet = Buffer.concat([
      basePacket,
      Buffer.from([0xff, 0xff, 0xff, 0xff]),
    ]);

    const challengeResponse = await this.socket.send(packet, port, ipAddress);
    const challengePayload = challengeResponse.slice(5);

    const rulesInfo = await this.socket.send(
      Buffer.concat([basePacket, challengePayload]),
      port,
      ipAddress
    );

    return getRulesSanitizer(rulesInfo);
  }

  async fetchServer(ipAddress, port) {
    const serverInfo = await this.getServerInfo(ipAddress, port);
    const playerInfo = await this.getPlayerInfo(ipAddress, port);
    const rules = await this.getRules(ipAddress, port);

    return { ...serverInfo, ...playerInfo, ...rules };
  }
}

export default SteamClient;
