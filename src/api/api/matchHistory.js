import config from '../config';
import {exec} from '../util';

export default function (region) {
  return {
    getBySummonerId(summonerId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.MATCH_HISTORY;
      options.id = summonerId;
      options.query = {
        championIds: options.championIds instanceof Array ? options.championIds.join() : options.championIds || null,
        rankedQueues: options.rankedQueues instanceof Array ? options.rankedQueues.join() : options.rankedQueues || null,
        beginIndex: options.beginIndex || null,
        endIndex: options.endIndex || null
      };

      return exec(options);
    }
  };
};