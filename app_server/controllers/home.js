/**
 * Created by aman1 on 13/04/2017.
 */


module.exports.home = function (req, res) {
    res.render('index', {
        title: 'VISA APPLICATION AND PROCESSING',
        greeting: 'WELCOME,',
        information: ' visiting Ethiopia for pleasure has never been easier.'
    });
};



module.exports.newApplication = function (req, res) {
    res.render('index', {
        title: 'New application page'
    });
};