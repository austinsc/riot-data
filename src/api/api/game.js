import {RECENT_GAMES} from '../../Constants';

export const Game = {
  getBySummonerId(summonerId, options) {
    return Object.assign({}, options, {
      uri: RECENT_GAMES,
      id: summonerId
    });
  }
};
