var express = require('express');
var router = express.Router();

// Get room
router.get('/',  function(req, res){
	res.render('room', {user: req.user} );
});




module.exports = router;
