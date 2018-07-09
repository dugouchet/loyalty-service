'use strict';

const MongoClient = require( 'mongodb' ).MongoClient;
const assert = require('assert');

const { url, name, options } = require('config').mongodb;

var db;

module.exports = {
  connectToServer: function () {
    MongoClient.connect(url, options, function (err, client) {
      assert.equal(null, err);
      db = client.db(name);
    } );
  },
  getDb: function () {
    return db;
  }
};
