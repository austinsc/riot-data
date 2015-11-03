import config from '../config';
import {exec} from '../util';

export default function (region) {
  return {
    get(shardName, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATUS_SHARD_ID;
      options.names = shardName;
      options.useHttp = true;
      options.host = 'http://status.leagueoflegends.com';

      return exec(options);
    },

    getAll(options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATUS_SHARD_LIST;
      options.useHttp = true;
      options.host = 'http://status.leagueoflegends.com';

      return exec(options);
    }
  };
};