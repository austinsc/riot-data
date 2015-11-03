import _ from 'lodash';
export default function (region) {
  'use strict';

  var config = require('../config');
  var util = require('../util');

  return {
    get(options, callback) {
      if (arguments.length === 1 && _.isFunction(options)) {
        callback = arguments[0];
        options = null;
      }

      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.FEATURED_GAMES;
      options.endpoint = 'api.pvp.net';

      return exec(options);
    }
  };

};