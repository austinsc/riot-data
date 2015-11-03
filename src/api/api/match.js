import {MATCH} from '../../Constants';

export const Match = {
  get(matchId, options = {}) {
    return Object.assign({}, options, {
      id: matchId,
      uri: MATCH,
      query: {
        includeTimeline: options.includeTimeline || false
      }
    });
  }
};