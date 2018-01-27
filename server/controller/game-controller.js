
class GameController {
  constructor() {
    this.gameDataCache = {};
    this.obfuscatedGameDataCache = {};
    this.uniqueGameId = 100;
  }

  cacheGame(gameData, obfuscatedGameData) {
    this.gameDataCache[gameData.gameId] = gameData;
    this.obfuscatedGameDataCache[gameData.gameId] = obfuscatedGameData;
  }

  getAllGameData(gameId) {
    let gameData = this.getGameDataById(gameId);
    let obfuscatedGameData = this.getObfuscatedGameDataById(gameId);
    return { gameData: gameData, obfuscatedGameData: obfuscatedGameData };
  }

  getGameDataById(gameId) {
    let gameData = this.gameDataCache[gameId];
    if (!gameData) {
      gameData = this.getGameDataFromDb(gameId);
    }
    return gameData;
  }

  getGameDataFromDb(gameId) {
    //TODO: Get game data from Db
    let gameData = {
      gameId: gameId
    }
    return gameData;
  }

  getObfuscatedGameDataById(gameId) {
    let gameData = this.obfuscatedGameDataCache[gameId];
    if (!gameData) {
      gameData = this.getObfuscatedGameDataFromDb(gameId);
    }
    return gameData;
  }

  getObfuscatedGameDataFromDb(gameId) {
    //TODO: Get game data from Db
    let gameData = {
      stepsSinceLastEncounter: 1
    }
    return gameData;
  }

  generateNewGameId() {
    //TODO: Save latest gameId in the db I guess.
    return this.uniqueGameId++;
  }

  generateNewGameObfuscatedData() {
    return {
      stepsSinceLastEncounter: 0,
      alreadyEncounteredEvents: {}
    };
  }
}

module.exports = GameController;