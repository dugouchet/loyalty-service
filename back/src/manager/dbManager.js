'use strict';

const db = require('../model/database');

/**
 *
 * @param idRider int
 * @param numberOfRide int
 * @param status int
 * @param loyaltyPoint int
 */
exports.updateRider = function (
  idRider,
  {
    numberOfRide,
    status,
    loyaltyPoint
  } = {}
) {
  // todo filter with undefined values
  return db.getDb().collection('riders')
    .updateOne({idRider}
    , { $set: { numberOfRide, status, loyaltyPoint } });

};

/**
 *
 * @param id
 */
exports.findOneRider = function (id) {
  // Get the riders collection
    return db.getDb().collection('riders')
      .findOne({},{idRider: id})
      .then((res)=> {
        if (res) {
          return res;
        }
        throw new Error('rider not found : ', id);
      });
};

/**
 *
 * example
 * bronze:     0 <= NB rides < 20
 * silver:    20 <= NB rides < 50
 * gold:      50 <= NB rides < 100
 * platinum: 100 <= NB rides
 *
 * bronze:   1€ = 1  point
 * silver:   1€ = 3  points
 * gold:     1€ = 5  points
 * platinum: 1€ = 10 points
 *
 * @param numberOfRides
 * @returns {number}
 */
exports.updateStatus = function (numberOfRides) {
  switch (true) {
    case 0 <= numberOfRides && numberOfRides < 20:
      return 1;
    case 20 <= numberOfRides && numberOfRides < 50:
      return 3;
    case 50 <= numberOfRides && numberOfRides < 100:
      return 5;
    default:
      return 10;
  }
};

/**
 *
 * @param idRider
 * @param ridePrice
 */
exports.updateLoyalty = function (idRider, ridePrice) {
  this.findOneRider(idRider)
    .then((rider) => {
    this.updateRider(rider.idRider, {
      numberOfRide: rider.numberOfRide +1,
      status: this.updateStatus(rider.numberOfRide),
      loyaltyPoint: rider.loyaltyPoint + rider.status * ridePrice
      }
    );
    });
};
