import {CHAMPION_ID, CHAMPION_LIST} from '../../Constants';

export const Champion = {
  get(championId, options) {
    return Object.assign({}, options, {
      id: championId,
      uri: CHAMPION_ID,
      query: {
        freeToPlay: options.freeToPlay || false
      }
    });
  },

  getAll(options) {
    return Object.assign({}, options, {
      uri: CHAMPION_LIST,
      query: {
        freeToPlay: options.freeToPlay || false
      }
    });
  }
};
