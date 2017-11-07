var Party = require('./model/Party');
var PartyController = require('./controller/party-controller');

var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(request, result, next) {
  // Log request. Maybe make sure the request has a valid key for the next move?
  console.log('Request Url: ', request.originalUrl);
  console.log('Request Body: ', request.body);
  next();
});

router.get('/', function(req, res) {
  res.json({message: 'hblah blah blah i am cool'});
});

router.route('/party')
  
// Create a new party | partyNames: array with 6 names
  .post(function(request, result) {
    console.log('request.body ', request.body);
    if (!request.body || !request.body.partyNames || request.body.partyNames.length !== 6) {
      result.send('You suck you need to specify a partyNames array with 6 names.');
    } else {
      var newParty = PartyController.createParty(request.body.partyNames);
      result.json( newParty );
    }
  })

  // Returns all parties. (Testing/convenience method.)
  // TODO: Delete this because it shouldn't exist.
  .get(function(request, result) {
    result.json({ parties: PartyController.getParties() });
  });

  router.route('/party/:partyId')

    // Get party by id.
    .get(function(request, result) {
      var party = PartyController.getParty(request.params.partyId);

      if (!party) {
        result.json({ error: 'Party not found.'});
      }
      result.json({ party: party });
    })

    // Change the party location.
    // TODO: Move me under a more specific route.
    .put(function(request, result) {
      if (!request.body || !request.body.movementDelta || !request.body.facingDirection) {
        result.json({ error: 'Please specify a movement delta {x, y}, and a facing directions (string).'});
      } else {
        var party = PartyController.processMovementRequest(request.params.partyId, request.body);
        result.json({ party: party});
      }
    });

app.use('/dungeon-stroll', router);

export default app;



/* DUNGEON-STROLL API
 * ====================
 * 
 * base: 
 * /dungeon-stroll
 * 
 * party: Object that contains all player facing game state for the party
 * 
 * GET: /dungeon-stroll/party/{id} | Returns game state for party
 * 
 * POST: /dungeon-stroll/party/{id}/moveOrder | Move the party
 *  Body argument: movement delta {x, y, facingDirection}
 *  Returns: New party state DTO
 * 
 * POST: /dungeon-stroll/party | Create a new party
 *  Body argument: new party data? { characterNames[] }
 * 
 *
 * 
 * 
 * 
 * 
 * 
 * 
 */ 


