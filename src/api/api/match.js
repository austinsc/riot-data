import _ from 'lodash';
export default function (region) {
  'use strict';

  var config = require('../config');
  var util = require('../util');

  return {
    get(matchId, options, callback) {
      if (arguments.length === 2 && _.isFunction(options)) {
        callback = arguments[1];
        options = null;
      }

      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.MATCH;
      options.id = matchId;
      options.query = {
        includeTimeline: options.includeTimeline || false
      };

      return exec(options);
    }
  };

};