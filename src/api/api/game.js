import config from '../config';
import {exec} from '../util';

export default function (region) {
  return {
    getBySummonerId(summonerId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.RECENT_GAMES;
      options.id = summonerId;

      return exec(options);
    }
  };
};