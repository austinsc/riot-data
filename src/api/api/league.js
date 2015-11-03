import _ from 'lodash';
export default function (region) {
  'use strict';

  var config = require('../config');
  var util = require('../util');

  return {
    getBySummonerId(summonerId, options, callback) {
      if (arguments.length === 2 && _.isFunction(options)) {
        callback = arguments[1];
        options = null;
      }

      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.LEAGUE_BY_SUMMONER_FULL;
      options.id = summonerId;

      return exec(options);
    },

    getEntriesBySummonerId(summonerId, options, callback) {
      if (arguments.length === 2 && _.isFunction(options)) {
        callback = arguments[1];
        options = null;
      }

      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.LEAGUE_BY_SUMMONER;
      options.id = summonerId;

      return exec(options);
    },

    getByTeamId(teamId, options, callback) {
      if (arguments.length === 2 && _.isFunction(options)) {
        callback = arguments[1];
        options = null;
      }

      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.LEAGUE_BY_TEAM_FULL;
      options.id = teamId;

      return exec(options);
    },

    getEntriesByTeamId(teamId, options, callback) {
      if (arguments.length === 2 && _.isFunction(options)) {
        callback = arguments[1];
        options = null;
      }

      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.LEAGUE_BY_TEAM;
      options.id = teamId;

      return exec(options);
    },

    getChallenger(type, options, callback) {
      if (arguments.length === 2 && _.isFunction(options)) {
        callback = arguments[1];
        options = null;
      }

      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.CHALLENGER_LEAGUE;
      options.query = {
        type: type || 'RANKED_SOLO_5x5'
      };

      return exec(options);
    }
  };

};