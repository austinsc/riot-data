import {TEAM_ID, TEAM_BY_SUMMONER} from '../../Constants';

export const Team = {
  get(teamId, options = {}) {
    return Object.assign({}, options, {
      id: teamId,
      uri: TEAM_ID
    });
  },

  getBySummonerId(summonerId, options = {}) {
    return Object.assign({}, options, {
      id: summonerId,
      uri: TEAM_BY_SUMMONER
    });
  }
};