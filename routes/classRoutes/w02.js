// ta code example; partial

const router = require("express").Router();

// ...
// creator: "Activision"
// }
// ]
router.get('/', (req, res) => {
  res.render('pages/classActivities/w02/home', {
    games: games
  });
});

// route to display one single game and creator
router.get('/game/', (req, res) => {
  // constants to hold param values
  const title = req.query.gameTitle;
  const creator = req.query.gameCreator;

  // render game.ejs passing objects for ejs
  res.render('pages/classActivities/w02/game', {
    title: title, 
    creator: creator
  });
});

// route to display one single game and creator
router.get('/game/:gameCreator/:gameTitle', (req, res) => {
  // constants to hold param values
  const title = req.query.gameTitle;
  const creator = req.query.gameCreator;

  // render game.ejs passing objects for ejs
  res.render('pages/classActivities/w02/game', {
    title: title, 
    creator: creator
  });
});

// route for a list of games
router.get('/gamelist', (req, res) => {
  res.render('pages/classActivities/w02/gamelist', {
    gameList: games
  });
});

module.exports = router;