import config from '../config';
import {exec} from '../util';

export default function (region) {
  return {
    get(teamId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.TEAM_ID;
      options.id = teamId;

      return exec(options);
    },

    getByTeamId(teamId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.TEAM_ID;
      options.id = teamId;

      return exec(options);
    },

    getBySummonerId(summonerId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.TEAM_BY_SUMMONER;
      options.id = summonerId;

      return exec(options);
    }
  };
};