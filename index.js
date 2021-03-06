/*jslint node:true, vars:true, nomen:true*/
'use strict';

// Load required modules
var MustacheEngine = require('mu2'); // mu2 is a fast mustache engine
var fs = require('fs');

var productcontroller = require('./controller/product');
var categorycontroller = require('./controller/category');

var express = require('express');
var app = express();

var routes = {
    'test1': {
        'type': 'product',
        'id': '1'
    },
    'test2': {
        'type': 'product',
        'id': '2'
    },
    'test3': {
        'type': 'product',
        'id': '3'
    },
    'cat1': {
        'type': 'category',
        'id': '1'
    }
};

var controllers = {
    'product': productcontroller,
    'category': categorycontroller
};

routes['/'] = routes.cat1;

app.use(express.logger());

app.use('/static', express.static(__dirname + '/static'));

app.use('/public', express.static(__dirname + '/public'));

app.get('/:resource?/:view?', function (req, res) {
    var resource = req.params.resource || '/';
    var view = req.params.view || 'view';
    var route = routes[resource];

    if (!route) {
        res.send(404, "no route found for '" + resource + "'.");
        res.end();
        return;
    }

    var controller = controllers[route.type];

    if (!controller) {
        res.send(500, "'" + resource + "' has an unknown type '" + route.type + "'.");
        res.end();
        return;
    }

    var data;
    try {
        data = controller.getData(route.id);
    } catch (e) {
        res.send(500, e);
        res.end();
        return;
    }

    if (view === 'json') {
        res.send(JSON.stringify(data));
        res.end();
        return;
    }

    var template = './templates/' + route.type + '/' + view + '.html';

    fs.stat(template, function (err, stat) {
        if (err || !stat.isFile()) {
            res.send(500, err || template + ' is no file.');
            res.end();
            return;
        }

        var stream = MustacheEngine.compileAndRender(template, data);
        stream.pipe(res);
    });
});

var port = 8000;
console.log("listening on port " + port);
app.listen(port);