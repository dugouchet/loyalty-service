const http = require('http');
const co = require('co');
const express = require('express');
const database = require('./src/model/database');
const { configure } = require('./src/lib/express');
const { amqp } = require('config');
const {handleRideCompleted }= require('./src/lib/handlers/rideCompleted');

let app;
let server;

//todo use a real logger as winston

const open = require('amqplib').connect(amqp.url);

const setConsumer = function () {
  // Consumer
  open.then(function (conn) {
    return conn.createChannel();
  }).then(function (ch) {
    return Promise.all([
      ch.assertExchange(amqp.exchange),
      ch.assertQueue(amqp.queue),
      ch.bindQueue(amqp.queue, amqp.exchange, amqp.routingKey)
      ]
    )
      .then(()=> {
        return ch.consume(amqp.queue, function (msg) {
          if (msg !== null) {
            handleRideCompleted(msg);
            ch.ack(msg);
          }
        });
      });
  }).catch(console.warn);
};

/**
 * Start the web app.
 *
 * @returns {Promise} when app end to start
 */
async function start() {
  if (app) {
    return app;
  }
  app = configure(express());

  const port = app.get('port');
  server = http.createServer(app);

  try {
    // connection to the database
    await database.connectToServer();

    // sever trying to listen to the port
    await server.listen(port);

    await setConsumer();

    // eslint-disable-next-line no-console
    console.log(`✔ Server running on port ${port}`);
    return app;
  }
  catch (err) {
    console.log('error');
}
}

/**
 * Stop the web app.
 *
 * @returns {Promise} when app end to start
 */
async function stop() {
  if (server) {
    await server.close();
    server = null;
    app = null;
  }
  return Promise.resolve();
}

if (!module.parent) {
  co(start);
}

module.exports = {
  start,
  stop,
  get server() {
    return server;
  },
  get app() {
    return app;
  }
};

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

