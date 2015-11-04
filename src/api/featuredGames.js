import {FEATURED_GAMES} from '../Constants';

export const FeaturedGames = {
  get(options = {}) {
    return Object.assign({}, options, {
      endpoint: 'api.pvp.net',
      uri: FEATURED_GAMES
    });
  }
};
