var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.connect('MONGODB_URI');
var User = require('../app_server/model/user');

router.get('/', checkLoggedIn, function (req, res) {
    res.render('request', {
        user: req.user // get the user out of session and pass to template
    });
});

router.post('/', checkLoggedIn, function (req, res) {
    console.log(req.body); //data should be stored in DB
    var ride = {
        userType : req.body.userType,
        area : req.body.area,
        points : req.body.points,
        date : req.body.date,
        time : req.body.time,
        driverPref : req.body.driverPref
    };

    User.findByIdAndUpdate(
        req.user._id,
        {$push: {rideHistory: ride}},
        {safe: true, upsert: true},
        function (err, model) {
            console.log(err + "Didn't work");
        }
    );
    res.redirect('/trips');
});

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    //Redirect to home if not logged in
    res.redirect('/');
}
module.exports = router;