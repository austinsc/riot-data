import config from '../config';
import {exec} from '../util';

export default function (region) {
  return {
    getBySummonerId(summonerId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.CURRENT_GAME;
      options.id = summonerId;
      options.platformId = config.platforms[options.region];
      options.endpoint = 'api.pvp.net';

      return exec(options);
    }
  };
};