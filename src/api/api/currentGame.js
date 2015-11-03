import {CURRENT_GAME, PLATFORMS} from '../../Constants';

export const CurrentGame = {
  getBySummonerId(summonerId, options = {}) {
    return Object.assign({}, options, {
      endpoint: 'api.pvp.net',
      uri: CURRENT_GAME,
      id: summonerId,
      platformId: PLATFORMS[options.region]
    });
  }
};