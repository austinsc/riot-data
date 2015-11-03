import config from '../config';
import {exec} from '../util';

export default function (region) {
  return {
    getRanked(summonerId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.RANKED_STATS;
      options.id = summonerId;
      options.query = {
        season: options.season || null
      };

      return exec(options);
    },

    getSummary(summonerId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STAT_SUMMARY;
      options.id = summonerId;
      options.query = {
        season: options.season || null
      };

      return exec(options);
    }
  };
};