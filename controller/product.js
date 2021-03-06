/*jslint node:true,nomen:true, vars:true*/
'use strict';

var REST = require('../rest');
var _ = require('underscore');

exports.getData = function (id) {
    var product = REST.get('/products/' + id);

    var shop = REST.get('/shop');

    product.ListPrice = product.ListPrice + ' €';

    return _.extend(product, shop);
};