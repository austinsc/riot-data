import {MATCH_HISTORY} from '../Constants';

export const MatchHistory = {
  getBySummonerId(summonerId, options = {}) {
    return Object.assign({}, options, {
      id: summonerId,
      uri: MATCH_HISTORY,
      query: {
        championIds: options.championIds instanceof Array ? options.championIds.join() : options.championIds || null,
        rankedQueues: options.rankedQueues instanceof Array ? options.rankedQueues.join() : options.rankedQueues || null,
        beginIndex: options.beginIndex || null,
        endIndex: options.endIndex || null
      }
    });
  }
};