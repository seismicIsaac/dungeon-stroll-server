const NEW_GAME_X = 5;
const NEW_GAME_Y = 5;
const NEW_GAME_FACING_DIRECTION = 'north';

class  LocationController {
  isValidLocationRequest(request) {
    return request.body && request.body.movementDelta && request.body.movementDelta.facingDirection;
  }

  // Determine new location after movement requests. 
  processMovementRequest(location, movementRequest) {
    let newLocation = {x: location.x, y: location.y, facingDirection: location.facingDirection };
    newLocation.x = location.x + movementRequest.x;
    newLocation.y = location.y + movementRequest.y;
    newLocation.facingDirection = movementRequest.facingDirection;
    return newLocation;
  }

  //TODO: Subtract less stamina / time of day if you weren't able to move?
  getStaminaCostOfMovement(isTurning, staminaCostOfTile) {
    return isTurning ? staminaCostOfTile / 4 : staminaCostOfTile;
  }

  isTurning(oldLocation, newLocation) {
    return oldLocation.facingDirection !== newLocation.facingDirection;
  }

  getNewGameLocation() {
    return {
        x: NEW_GAME_X,
        y: NEW_GAME_Y,
        facingDirection: NEW_GAME_FACING_DIRECTION
    };
  }
}

module.exports = LocationController;