import {LEAGUE_BY_SUMMONER_FULL, LEAGUE_BY_SUMMONER, LEAGUE_BY_TEAM_FULL, LEAGUE_BY_TEAM, CHALLENGER_LEAGUE} from '../Constants';

export const League = {
  getBySummonerId(summonerId, options) {
    return Object.assign({}, options, {
      id: summonerId,
      uri: LEAGUE_BY_SUMMONER_FULL
    });
  },

  getEntriesBySummonerId(summonerId, options) {
    return Object.assign({}, options, {
      id: summonerId,
      uri: LEAGUE_BY_SUMMONER
    });
  },

  getByTeamId(teamId, options) {
    return Object.assign({}, options, {
      id: teamId,
      uri: LEAGUE_BY_TEAM_FULL
    });
  },

  getEntriesByTeamId(teamId, options) {
    return Object.assign({}, options, {
      id: teamId,
      uri: LEAGUE_BY_TEAM
    });
  },

  getChallenger(type, options) {
    return Object.assign({}, options, {
      uri: CHALLENGER_LEAGUE,
      query: {
        type: type || 'RANKED_SOLO_5x5'
      }
    });
  }
};
