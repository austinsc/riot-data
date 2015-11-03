import {STATUS_SHARD_ID, STATUS_SHARD_LIST} from '../../Constants';

export const Status = {
  get(shardName, options = {}) {
    return Object.assign({}, options, {
      names: shardName,
      uri: STATUS_SHARD_ID,
      host: 'http://status.leagueoflegends.com',
      useHttp: true
    });
  },

  getAll(options = {}) {
    return Object.assign({}, options, {
      uri: STATUS_SHARD_LIST,
      host: 'http://status.leagueoflegends.com',
      useHttp: true
    });
  }
};