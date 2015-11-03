import {SUMMONER_ID, SUMMONER_BY_NAME, SUMMONER_NAME, SUMMONER_RUNES, SUMMONER_MASTERIES} from '../../Constants';

export const Summoner = {
  get(summonerIds, options = {}) {
    return Object.assign({}, options, {
      id: summonerIds,
      uri: SUMMONER_ID
    });
  },

  getByName(summonerNames, options = {}) {
    return Object.assign({}, options, {
      uri: SUMMONER_BY_NAME,
      names: summonerNames instanceof Array ? summonerNames.join() : summonerNames
    });
  },

  getName(summonerIds, options = {}) {
    return Object.assign({}, options, {
      id: summonerIds,
      uri: SUMMONER_NAME
    });
  },

  getRunes(summonerIds, options = {}) {
    return Object.assign({}, options, {
      id: summonerIds,
      uri: SUMMONER_RUNES
    });
  },

  getMasteries(summonerIds, options = {}) {
    return Object.assign({}, options, {
      id: summonerIds,
      uri: SUMMONER_MASTERIES
    });
  }
};