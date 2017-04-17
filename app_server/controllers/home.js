/**
 * Created by aman1 on 13/04/2017.
 */


module.exports.home = function (req, res) {
    res.render('index', {
        title: 'WELCOME,',
        information: ' visiting Ethiopia for pleasure has never been easier.' +
                        'Home to vast and diverse natural wild life reserves, blessed with tropical, all year round ' +
                        'summer weather and a diverse cultural heritage.'
    });
};



module.exports.newApplication = function (req, res) {
    res.render('new_application', {
        title: 'New application'
    });
};