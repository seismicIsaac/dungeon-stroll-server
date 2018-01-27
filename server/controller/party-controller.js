class PartyController {

  createParty(names) {
    let partyMembers = [];
    for (let i = 0; i < names.length; i++) {
      partyMembers.push(this.createPartyMember(names[i]));
    }
    let newParty = {
      members: partyMembers,
      visionRadius: 3,
    };
    return newParty;
  }

  createPartyMember(name) {
    return {
      health: 100,
      totalHealth: 100,
      stamina: 100,
      totalStamina: 100,
      mana: 5,
      totalMana: 5,
      name: name
    }
  }

  adjustStamina(partyMembers, staminaCost) {
    //If we're turning, less time passes and we shouldn't take as much stamina away.
    partyMembers.forEach((member) => { member.stamina -= staminaCost});
    return partyMembers;
  }
}

module.exports = PartyController;