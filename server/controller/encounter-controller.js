const STEPS_TAKEN_MULTIPLIER = .02;
const CAPITAL_A_ASCII_KEYCODE = 65;
const MIN_HIP = 1;

class EncounterController {

  constructor() {
    this.monsterTableByRegion = {};
    
    //Load this table from DB or File
    this.monsterTableByRegion[1] = [
      [ [1, 1, 1] ],
      [ [1, 1], [2] ],
      [ [1], [2, 2] ],
      [ [2, 2] ],
      [ [3] ],
      [ [1, 1], [3] ],
      [ [3], [2], [1] ],
      [ [3], [2], [2] ]
    ];
    //Load this table from DB or File
    this.monsterDataById = {
      1: {
        name: 'Dewdax',
        maxHP: 12,
        hpBonus: 2,
        thaco: 20,
        damage: 3,
        damageBonus: 0
      },
      2: {
        name: 'Blitkane',
        maxHP: 14,
        hpBonus: 4,
        thaco: 19,
        damage: 4,
        damageBonus: 2
      },
      3: {
        name: 'Tyrior',
        maxHP: 7,
        thaco: 18,
        damage: 7,
        damageBonus: 1
      },
      4: {
        name: 'Dark Elvish Magi',
        maxHP: 22,
        hpBonus: 6,
        thaco: 17,
        damage: 8,
        damageBonus: 2
      }
    };
  }

  getAreMonstersEncountered(stepsSinceLastEncounter) {
    return Math.random() < stepsSinceLastEncounter * STEPS_TAKEN_MULTIPLIER;
  }

  getMonsterGroups(region) {
    const monsterTable = this.monsterTableByRegion[region];
    const size = monsterTable.length;
    return monsterTable[Math.floor(Math.random() * size)];
  }

  getPlayerFacingMonsterGroups(monsterGroups) {
    return monsterGroups.map((monsterIdsArray) =>
            monsterIdsArray.map((monsterId, index) =>
              this.getPlayerFacingMonsterDataById(monsterId, index)
            )
          );
  }

  getObfuscatedMonsterGroups(monsterGroups) {
    return monsterGroups.map((monsterIdsArray) =>
            monsterIdsArray.map((monsterId, index) =>
              this.getMonsterObfuscatedMonsterDataById(monsterId)
            )
          );
  }

  getPlayerFacingMonsterDataById(monsterId, ordinal) {
    return {
      name: this.monsterDataById[monsterId].name + ' ' + this.getMonsterAlphaOrdinal(ordinal),
      id: monsterId
    };
  }

  getMonsterAlphaOrdinal(ordinal) {
    return String.fromCharCode(CAPITAL_A_ASCII_KEYCODE + ordinal);
  }

  getMonsterObfuscatedMonsterDataById(monsterId) {
    const monsterTemplate = this.monsterDataById[monsterId];
    return this.buildMonsterFromTemplate(monsterTemplate);
  }

  buildMonsterFromTemplate(template) {
    return {
      hp: Math.floor(Math.random() * template.maxHP) + MIN_HIP + template.hpBonus,
      thaco: template.thaco,
      damage: template.damage,
      damageBonus: template.damageBonus
    }
  }

}

module.exports = EncounterController;