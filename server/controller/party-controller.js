var MapController = require('./map-controller');

var PartyController = {
  parties: {},
  partyId: 1,
  
  getParty: function(id) {
    return this.parties[id];
  },

  getParties: function() {
    return this.parties;
  },

  createParty: function(names) {
    var partyMembers = [];
    for (var i = 0; i < names.length; i++) {
      partyMembers.push(this.createPartyMember(names[i]));
    }
    var newParty = {
      members: partyMembers,
      id: this.partyId++,
      location: {
        x: Math.floor(Math.random() * 5 + 1),
        y: Math.floor(Math.random() * 5 + 1),
        facingDirection: 'north'
      },
      visionRadius: 3,
      dateTime: {
        day: 1,
        time: 700
      }
    };
    newParty.viewableMap = MapController.getViewableMapForParty(newParty.location, newParty.visionRadius);
    this.parties[newParty.id] = newParty;
    return newParty;
  },

  createPartyMember: function(name) {
    return {
      health: 100,
      totalHealth: 100,
      stamina: 100,
      totalStamina: 100,
      mana: 5,
      totalMana: 5,
      name: name
    }
  },

  processMovementRequest: function(partyId, movementRequest) {
    var party = this.getParty(partyId);
    var oldLocation = Object.assign({}, party.location);

    if (MapController.isValidMovementRequest(party.location, movementRequest)) {
      party.location.x += movementRequest.movementDelta.x;
      party.location.y += movementRequest.movementDelta.y;
      party.location.facingDirection = movementRequest.facingDirection;
      party.viewableMap = MapController.getViewableMapForParty(party.location, party.visionRadius);
    }
    this.adjustStamina(party.members, party.location, oldLocation);
    this.adjustTimeOfDay(party, oldLocation);
    //TODO: Handle Input rather than taking a delta so the server can do whatever it wants.
    return party;
  },

  //TODO: Subtract less stamina / time of day if you weren't able to move?
  adjustStamina: function(partyMembers, newLocation, oldLocation) {
    let staminaCost = MapController.getStaminaCostOfMovement(newLocation);
    //If we're turning, less time passes and we shouldn't take as much stamina away.
    staminaCost = this.isTurning(newLocation, oldLocation) ? staminaCost / 4 : staminaCost;

    for (let i = 0; i < partyMembers.length; i++) {
      let remainingStamina = partyMembers[i].stamina - staminaCost;
      partyMembers[i].stamina = (remainingStamina < 0) ? 0 : remainingStamina;
    }
  },

  adjustTimeOfDay: function(party, oldLocation) {
    let time = party.dateTime.time;
    time += this.isTurning(party.location, oldLocation) ? 15 : 100;

    if (time % 100 >= 60) {
      time += 100;
      time -= 60;
    }

    if (time > 2400) {
      time -= 2400;
      party.day++;
    }
    party.dateTime.time = Number((time).toFixed(2));
  },

  isTurning: function(newLocation, oldLocation) {
    return newLocation.facingDirection !== oldLocation.facingDirection;
  }
}

module.exports = PartyController;