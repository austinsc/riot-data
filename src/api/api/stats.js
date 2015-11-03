import {RANKED_STATS, STAT_SUMMARY} from '../../Constants';

export const Stats = {
  getRanked(summonerId, options = {}) {
    return Object.assign({}, options, {
      id: summonerId,
      uri: RANKED_STATS,
      query: {
        season: options.season || null
      }
    });
  },

  getSummary(summonerId, options = {}) {
    return Object.assign({}, options, {
      id: summonerId,
      uri: STAT_SUMMARY,
      query: {
        season: options.season || null
      }
    });
  }
};