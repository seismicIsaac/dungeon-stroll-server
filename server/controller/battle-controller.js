
class BattleController {
  initializePlayerFacingBattleState(monsterGroups) {
    console.log('Monster Groups: ', monsterGroups);
    return { turn: 0,
      monsterGroups: monsterGroups,
      battleLog: [ {eventName: 'battleStart'} ]
    };
  }

  initializeObfuscatedBattleState(monsterGroups) {
    return { turn: 0,
      monsterGroups: monsterGroups
    }

  }
}

module.exports = BattleController;