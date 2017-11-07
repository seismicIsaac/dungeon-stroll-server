var testMap = [      [4, 4, 1, 6, 2, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 5, 2, 2],
                     [4, 2, 2, 1, 6, 6, 6, 2, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2],
                     [2, 2, 6, 6, 6, 2, 6, 6, 2, 2, 6, 6, 6, 6, 2, 5, 5, 2],
                     [6, 6, 6, 3, 3, 3, 2, 6, 2, 6, 6, 2, 2, 6, 6, 2, 6, 6],
                     [6, 1, 3, 4, 4, 4, 3, 6, 6, 6, 2, 2, 2, 2, 6, 6, 5, 2],
                     [6, 6, 6, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 5, 5, 5, 2],
                     [4, 4, 6, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 5, 2, 2, 2],
                     [2, 4, 6, 6, 4, 4, 2, 1, 2, 2, 2, 1, 2, 2, 5, 2, 2, 2],
                     [2, 4, 4, 6, 6, 4, 2, 1, 1, 2, 2, 2, 5, 5, 5, 2, 2, 2],
                     [2, 2, 2, 4, 6, 2, 2, 2, 2, 2, 2, 5, 5, 5, 2, 2, 2, 2],
                     [2, 2, 2, 2, 6, 1, 1, 1, 1, 2, 5, 5, 2, 5, 2, 2, 2, 2],
                     [2, 2, 2, 2, 6, 2, 1, 1, 2, 5, 5, 5, 5, 5, 5, 2, 2, 2]];
// test map dimensions: 18 x 12 

const isTerrainPassable = [false, true, true, false, false, true, true, true, true];
const staminaCostByTile = [0, 1, .5, 6, 8, 15, .25, 0, 0, 0];

var MapController = {
  initBlankMap: function() {
    var blankMap = new Array(12);

    for(let i = 0; i < blankMap.length; i++) {
      blankMap.push(Array.apply(null, Array(18)).map(Number.prototype.valueOf,0));
    }
    this.blankMap = blankMap;
  },

  getMap: function() {
    return testMap;
  },

  getViewableMapForParty: function(location, visionRadius) {
    let topLeftCorner = { x: location.x - visionRadius, y: location.y - visionRadius };
    let viewableMap = [[]];
    let tempArray = [];

    //Read topCorner.x --> topCorner.x + visionRadius

    for (let i = 0; i < visionRadius * 2 + 1; i++) {
      tempArray = [];
      for(let j = 0; j < visionRadius * 2 + 1; j++) {
        if ( topLeftCorner.y + i < 0
          || topLeftCorner.x + j < 0
          || topLeftCorner.y + i > testMap.length - 1 
          || topLeftCorner.x + j > testMap[topLeftCorner.y + i].length) {
          tempArray.push(0);
          continue;
        }
        tempArray.push(testMap[topLeftCorner.y + i][topLeftCorner.x + j]);
      }
      viewableMap.push(tempArray);
    }
    return viewableMap;
  },

  isValidMovementRequest: function(location, movementRequest) {
    let totalDistance = Math.abs(movementRequest.movementDelta.x) + Math.abs(movementRequest.movementDelta.y);
    let isChangingFacingDirection = movementRequest.facingDirection !== location.facingDirection; 
    let newLocation = {x: location.x + movementRequest.movementDelta.x, y: location.y + movementRequest.movementDelta.y};
    if (totalDistance > 1
       || (totalDistance === 1 && isChangingFacingDirection)) {
      return false;
    }
    return newLocation.x >= 0
      && newLocation.y >= 0
      && newLocation.x < testMap[0].length
      && newLocation.y < testMap.length
      && isTerrainPassable[testMap[newLocation.y][newLocation.x]];
  },
  
  getStaminaCostOfMovement: function(newLocation) {
    return staminaCostByTile[testMap[newLocation.y][newLocation.x]];
  }
}

module.exports = MapController;