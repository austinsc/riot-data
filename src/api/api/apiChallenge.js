import config from '../config';
import {exec} from '../util';

export default function (region) {
  return {
    get(timestamp, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.API_CHALLENGE;
      options.query = {
        beginDate: timestamp
      };

      return exec(options);
    }
  };
};