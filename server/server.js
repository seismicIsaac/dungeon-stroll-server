var GameController = require('./controller/game-controller');
var PartyController = require('./controller/party-controller');
var MapController = require('./controller/map-controller');
var LocationController = require('./controller/location-controller');
var TimeController = require('./controller/time-controller');
var EncounterController = require('./controller/encounter-controller');
var BattleController = require('./controller/battle-controller');
var MapEventController = require('./controller/map-event-controller');

var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;

var router = express.Router();

let gameController = new GameController();
let partyController = new PartyController();
let timeController = new TimeController();
let locationController = new LocationController();
let mapController = new MapController();
let encounterController = new EncounterController();
let battleController = new BattleController();
let mapEventController = new MapEventController();

router.use(function(request, result, next) {
  // Log request. Maybe make sure the request has a valid key for the next move?
  console.log('Request Url: ', request.originalUrl);
  console.log('Request Body: ', request.body);
  next();
});

router.get('/', function(req, res) {
  res.json({message: 'hblah blah blah i am cool'});
});

router.route('/game')
    //Create a new game
  .post(function(request, result) {
    if (!request.body || !request.body.partyNames || request.body.partyNames.length !== 6) {
      result.send('You suck you need to specify a partyNames array with 6 names.');
    } else {
      let gameData = {};
      let obfuscatedGameData = gameController.generateNewGameObfuscatedData();
      gameData.gameId = gameController.generateNewGameId();
      gameData.party = partyController.createParty(request.body.partyNames);
      gameData.location = locationController.getNewGameLocation();
      gameData.viewableMap = mapController.getViewableMap(gameData.location, gameData.party.visionRadius);
      gameData.dateTime = timeController.getNewGameDateTime();
      gameController.cacheGame(gameData, obfuscatedGameData);
      result.json( gameData );
    }
  });

  router.route('/game/:gameId')

    .get(function(request, result) {
      let gameData = gameController.getGameDataById(request.params.gameId)['gameData'];
      result.json(gameData);
    });

  //Player Actions
  router.route('/game/:gameId/location')
    .get(function(request, result) {
      let gameData = gameController.getGameDataById(request.params.gameId);
      result.json(gameData.location);
    })

    .put(function(request, result) {
      const gameId = request.params.gameId;
      const { gameData, obfuscatedGameData } = gameController.getAllGameData(gameId);
      if (!locationController.isValidLocationRequest(request) && !gameData.battleState) {
        result.json({ error: 'Please specify a movement delta {x, y}, and a facing directions (string).'});
      } else {
  
        console.log('GameData: ', gameData);
        console.log('Obfuscated game data: ', obfuscatedGameData);
        const movementRequest = request.body.movementDelta;
        const oldLocation = gameData.location;
        let newLocation = gameData.location;

        if (mapController.isValidMovementRequest(oldLocation, movementRequest)) {
          newLocation = locationController.processMovementRequest(oldLocation, movementRequest);
          newLocation.region = mapController.getRegion(newLocation);
          gameData.viewableMap = mapController.getViewableMap(newLocation, gameData.party.visionRadius);
        }
        gameData.location = newLocation;
        const staminaCostOfTile = mapController.getStaminaCostOfTile(newLocation);
        const isTurning = locationController.isTurning(oldLocation, newLocation);
        const staminaCost = locationController.getStaminaCostOfMovement(isTurning, staminaCostOfTile);

        gameData.party.members = partyController.adjustStamina(gameData.party.members, staminaCost);
        gameData.dateTime = timeController.adjustTimeOfDay(gameData.dateTime, isTurning);
        
        if (encounterController.getAreMonstersEncountered(obfuscatedGameData.stepsSinceLastEncounter)) {
          
          const monsterGroups = encounterController.getMonsterGroups(gameData.location.region);
          const playerFacingMonsterGroups = encounterController.getPlayerFacingMonsterGroups(monsterGroups);
          const obfuscatedMonsterGroups = encounterController.getObfuscatedMonsterGroups(monsterGroups);
          gameData.battleState = battleController.initializePlayerFacingBattleState(playerFacingMonsterGroups);
          obfuscatedGameData.battleState = battleController.initializeObfuscatedBattleState(obfuscatedMonsterGroups);
          obfuscatedGameData.stepsSinceLastEncounter = 0; // Wah wahh...
        } else if (mapEventController.getMapEvent(newLocation.x, newLocation.y)) {
          //Set some event state
        } else {
          obfuscatedGameData.stepsSinceLastEncounter++;
          console.log('Steps since last encounter: ', obfuscatedGameData.stepsSinceLastEncounter);
        }

        gameController.cacheGame(gameData, obfuscatedGameData);
        result.json(gameData);
      }
    });

app.use('/dungeon-stroll', router);

export default app;
