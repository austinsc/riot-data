// API Challenge
export const API_CHALLENGE = '/{string:region}/v4.1/game/ids';
// Champion
export const CHAMPION_LIST = '/{string:region}/v1.2/champion';
export const CHAMPION_ID = '/{string:region}/v1.2/champion/{int:id}';
// Current Game
export const CURRENT_GAME = '/observer-mode/rest/consumer/getSpectatorGameInfo/{string:platformId}/{int:id}';
// Feature Games
export const FEATURED_GAMES = '/observer-mode/rest/featured';
// Game
export const RECENT_GAMES = '/{string:region}/v1.3/game/by-summoner/{int:id}/recent';
// League
export const LEAGUE_BY_SUMMONER_FULL = '/{string:region}/v2.5/league/by-summoner/{int:id}';
export const LEAGUE_BY_SUMMONER = '/{string:region}/v2.5/league/by-summoner/{int:id}/entry';
export const LEAGUE_BY_TEAM_FULL = '/{string:region}/v2.5/league/by-team/{int:id}';
export const LEAGUE_BY_TEAM = '/{string:region}/v2.5/league/by-team/{int:id}/entry';
export const CHALLENGER_LEAGUE = '/{string:region}/v2.5/league/challenger';
// Match
export const MATCH = '/{string:region}/v2.2/match/{int:id}';
// Match history
export const MATCH_HISTORY = '/{string:region}/v2.2/matchhistory/{int:id}';
// Summoner
export const SUMMONER_BY_NAME = '/{string:region}/v1.4/summoner/by-name/{string:names}';
export const SUMMONER_ID = '/{string:region}/v1.4/summoner/{int:id}';
export const SUMMONER_NAME = '/{string:region}/v1.4/summoner/{int:id}/name';
export const SUMMONER_RUNES = '/{string:region}/v1.4/summoner/{int:id}/runes';
export const SUMMONER_MASTERIES = '/{string:region}/v1.4/summoner/{int:id}/masteries';
// Stats
export const RANKED_STATS = '/{string:region}/v1.3/stats/by-summoner/{int:id}/ranked';
export const STAT_SUMMARY = '/{string:region}/v1.3/stats/by-summoner/{int:id}/summary';
// Static
export const STATIC_CHAMPION = '/static-data/{string:region}/v1.2/champion';
export const STATIC_CHAMPION_ID = '/static-data/{string:region}/v1.2/champion/{int:id}';
export const STATIC_ITEM = '/static-data/{string:region}/v1.2/item';
export const STATIC_ITEM_ID = '/static-data/{string:region}/v1.2/item/{int:id}';
export const STATIC_MASTERY = '/static-data/{string:region}/v1.2/mastery';
export const STATIC_MASTERY_ID = '/static-data/{string:region}/v1.2/mastery/{int:id}';
export const STATIC_REALM = '/static-data/{string:region}/v1.2/realm';
export const STATIC_VERSIONS = '/static-data/{string:region}/v1.2/versions';
export const STATIC_RUNE = '/static-data/{string:region}/v1.2/rune';
export const STATIC_RUNE_ID = '/static-data/{string:region}/v1.2/rune/{int:id}';
export const STATIC_SUMMONER_SPELL = '/static-data/{string:region}/v1.2/summoner-spell';
export const STATIC_SUMMONER_SPELL_ID = '/static-data/{string:region}/v1.2/summoner-spell/{int:id}';
// Status
export const STATUS_SHARD_LIST = '/shards';
export const STATUS_SHARD_ID = '/shards/{string:names}';
// Team
export const TEAM_BY_SUMMONER = '/{string:region}/v2.4/team/by-summoner/{int:id}';
export const TEAM_ID = '/{string:region}/v2.4/team/{string:id}';

export const PLATFORMS = {
  br: 'BR1',
  na: 'NA1',
  lan: 'LA1',
  las: 'LA2',
  oce: 'OC1',
  eune: 'EUN1',
  euw: 'EUW1',
  tr: 'TR1',
  ru: 'RU',
  kr: 'KR'
};