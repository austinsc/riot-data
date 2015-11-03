import config from '../config';
import {exec} from '../util';

export default function (region) {
  return {
    get(summonerIds, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.SUMMONER_ID;
      options.id = summonerIds;

      return exec(options);
    },

    getByName(summonerNames, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.SUMMONER_BY_NAME;
      options.names = summonerNames instanceof Array ? summonerNames.join() : summonerNames;

      return exec(options);
    },

    getName(summonerIds, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.SUMMONER_NAME;
      options.id = summonerIds;

      return exec(options);
    },

    getRunes(summonerIds, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.SUMMONER_RUNES;
      options.id = summonerIds;

      return exec(options);
    },

    getMasteries(summonerIds, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.SUMMONER_MASTERIES;
      options.id = summonerIds;

      return exec(options);
    }
  };
};