var express = require('express');
var router = express.Router();

// Get Chat
router.get('/',/* ensureAuthenticated,*/ function(req, res){
	res.render('test', {user: req.user, room:req.room} );
});
/*
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}
*/


module.exports = router;
