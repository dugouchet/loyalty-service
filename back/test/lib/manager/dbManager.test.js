'use strict';

const request = require('supertest');
const { expect } = require('chai');

const { updateStatus } = require('../../../src/manager/dbManager');

describe('src/manager/dbManager', () => {


  describe('updateStatus', () => {
    it('should return status 3', () => {
      expect(updateStatus(25)).to.equal(3);
    });
  });
});
