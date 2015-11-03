import {API_CHALLENGE} from '../../Constants';

export const ApiChallenge = {
  get(timestamp, options = {}) {
    return Object.assign({}, options, {
      uri: API_CHALLENGE,
      query: {
        beginDate: timestamp
      }
    });
  }
};