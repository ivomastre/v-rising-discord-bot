const readString = (buffer, offset) => {
  const info = buffer.slice(offset, buffer.indexOf(0, offset));
  return {
    info: info.toString(),
    length: info.length,
  };
};

const read8BitInt = (buffer, offset) => {
  return buffer.readInt8(offset).toString();
};

const read32BitInt = (buffer, offset) => {
  return buffer.readInt32LE(offset).toString();
};

const read32BitFloat = (buffer, offset) => {
  return buffer.readFloatLE(offset).toString();
};

const readPlayerInfo = (buffer, offset) => {
  const index = read8BitInt(buffer, offset);
  offset += 1;

  const { info: playerName, length: nameLength } = readString(buffer, offset);
  offset += nameLength + 1;

  const score = read32BitInt(buffer, offset);
  offset += 4;

  const duration = read32BitFloat(buffer, offset);
  offset += 4;

  return {
    index,
    playerName,
    score,
    duration,
    newOffset: offset,
  };
};

const getServerInfoSanitizer = (buffer) => {
  let offset = 6;

  const { info: name, length: nameLength } = readString(buffer, offset);
  offset += nameLength + 1;

  const { length: mapLength } = readString(buffer, offset);
  offset += mapLength + 1;

  const { length: folderLength } = readString(buffer, offset);
  offset += folderLength + 1;

  const { length: gameLength } = readString(buffer, offset);
  offset += gameLength + 1;

  offset += 2;

  offset += 1;

  const maxPlayers = read8BitInt(buffer, offset);

  return {
    serverName: name,
    maxPlayers,
  };
};

const getPlayerInfoSanitizer = (buffer) => {
  let offset = 5;
  const playerCount = read8BitInt(buffer, offset);
  offset += 1;

  const players = [];
  let realPlayerCount = 0;

  for (let i = 0; i < playerCount; i++) {
    const { playerName, newOffset } = readPlayerInfo(buffer, offset);
    offset = newOffset;

    if (!playerName) {
      continue;
    }

    players.push(playerName);
    realPlayerCount++;
  }

  return { players, playerCount: realPlayerCount };
};

const getRulesSanitizer = (buffer) => {
  let offset = 7;

  const rules = {};

  while (offset < buffer.length) {
    const { info: key, length: keyLength } = readString(buffer, offset);
    offset += keyLength + 1;

    const { info: value, length: valueLength } = readString(buffer, offset);
    offset += valueLength + 1;

    rules[key] = value;
  }

  return {
    daysRunning: rules["days-runningv2"],
  };
};

export { getServerInfoSanitizer, getPlayerInfoSanitizer, getRulesSanitizer };
