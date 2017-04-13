/**
 * Created by aman1 on 13/04/2017.
 */


module.exports.home = function (req, res) {
    res.render('index', { title: 'Express' });
};