import config from '../config';
import {exec} from '../util';

export default function (region) {
  return {
    get(championId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.CHAMPION_ID;
      options.id = championId;

      return exec(options);
    },

    getAll(options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.CHAMPION_LIST;
      options.query = {
        freeToPlay: options.freeToPlay || false
      };

      return exec(options);
    }
  };
};