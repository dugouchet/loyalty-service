'use strict';

const dbManager = require('../../manager/dbManager');

exports.handleRideCompleted = function (msg) {
  const data = msg.content.toString();

  return dbManager.updateLoyalty(data.id, data.amount);
};
