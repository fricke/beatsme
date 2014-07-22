var express = require('express');
var path = require('path');

module.exports = function(app) {
    app.use('/bower_components', express.static(path.join(__dirname + '/../../bower_components')));
    app.use('/css', express.static(path.join(__dirname + '/../../dist/css')));
    app.use('/js', express.static(path.join(__dirname + '/../../dist/js')));
    app.use('/images', express.static(path.join(__dirname + '/../../dist/images')));
    app.use('/partials', express.static(path.join(__dirname + '/../../dist/html/partials')));
    app.use('/components', express.static(path.join(__dirname + '/../../dist/components')));
}