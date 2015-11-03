import _ from 'lodash';
import Q from 'q';
import https from 'https';
import mongodb from 'mongodb';
import Api from './api/lolapi';
import {inspect} from 'util';
import prettyjson from 'prettyjson';

function _print(data) {
  //console.log(inspect(data));
  console.log(prettyjson.render(data));
  return data;
}

// A
// CALL 1: Solo queue challenger.
// WAIT FOR 1 TO COMPLETE

// B
// CALL 2: Team list challenger.
// CALL 3: Team list master.
// WAIT FOR 2 & 3 TO COMPLETE
// Compile lists of teamIds - [teamInfoLimit] ids at a time.

// C
// CALL 4: Solo queue matchlist playerIds[0].
// CALL 5: Solo queue matchlist playerIds[1].
// ...
// CALL M: Solo queue matchlist playerIds[playerIds.length-1].
// WAIT FOR 4 - M TO COMPLETE

// D
// CALL M+1: Team info teamIdsLists[0].
// CALL M+2: Team info teamIdsLists[1].
// ...
// CALL N: Team info teamIdsLists[teamIdsLists.length-1].
// WIAT FOR M+1 - N TO COMPLETE

// Compile list of matchIds.
// Filter out any ids previously requested: db.any(record.matchId == matchId).

// E
// CALL N+1: Match info matchIds[0].
// CALL N+2: Match info matchIds[1].
// ...
// CALL K: Match info matchIds[matchIds.length-1].
// WAIT FOR N+1 - K TO COMPLETE
// Store match info in database.

export default class RiotAccess extends Api {
  constructor(config) {
    super(config);
    //const {apikey, region, mongodb} = config;
    //this.api = lolapi(apikey, region);
    //this.mongodb = mongodb;
  }

  initDatabase() {
    return new Promise((resolve, reject) => {
      mongodb.MongoClient.connect(this.mongodb, (err, database) => {
        if(err) {
          return reject(err);
        }
        resolve(this.database = database)
      });
    });
  }

  start() {
    //return this.initDatabase()
    //  .then(() => Q.nfcall(this.api.League.getChallenger, 'RANKED_TEAM_5x5'))
    //  .then(_print)
    //  .then(data => Q.all(data.entries.filter((x, i) => i < 5).map(x => Q.nfcall(this.api.Team.get, x.playerOrTeamId))))
    //  .then(_print);
    return this.Team.get('TEAM-ba6b55b0-d284-11e4-971b-c81f66ddabda')
      .then(_print);

  }

  stop() {

  }

}

/*
 (function() {
 "use strict";
 var db = null;

 var timeout = 10 * 1000, // 10 seconds
 requestCap = 500, // 500 Requests - Production will be 180,000.
 requestDuration = 10 * 60 * 1000, // 10 Minutes
 requestDelay = Math.ceil(1 / (requestCap / requestDuration)), // Required wait time between requests.
 teamInfoLimit = 10, // We can look up 10 teams via the teamInfoApi at a time.
 regions = ['br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'ru', 'tr'],
 tiers = ['challenger', 'master'],
 apiKey = '5f1c0c7d-d474-4b79-8480-a53c9c41ad60',
 host = '{region}.api.pvp.net',
 teamListApi = '${host}/api/lol/{region}/v2.5/league/{tier}?type=RANKED_TEAM_5x5&api_key=' + apiKey,
 soloListApi = '${host}/api/lol/{region}/v2.5/league/challenger?type=RANKED_SOLO_5x5&api_key=' + apiKey,
 teamInfoApi = '${host}/api/lol/{region}/v2.4/team/{teamIdList}?api_key=' + apiKey,
 matchListApi = '${host}/api/lol/{region}/v2.2/matchlist/by-summoner/{playerId}?rankedQueues=RANKED_SOLO_5x5&startTime={startTime}&api_key=' + apiKey,
 matchInfoApi = '${host}/api/lol/{region}/v2.2/match/{matchId}?includeTimeline=true&api_key=' + apiKey,
 staticApi = {
 champion: '/api/lol/static-data/{region}/v1.2/champion?champData=all&api_key=' + apiKey,
 item: '/api/lol/static-data/{region}/v1.2/item?itemListData=all&api_key=' + apiKey,
 map: '/api/lol/static-data/{region}/v1.2/map?api_key=' + apiKey,
 mastery: '/api/lol/static-data/{region}/v1.2/mastery?masteryListData=all&api_key=' + apiKey,
 rune: '/api/lol/static-data/{region}/v1.2/rune?runeListData=all&api_key=' + apiKey,
 summonerSpell: '/api/lol/static-data/{region}/v1.2/summoner-spell?spellData=all&api_key=' + apiKey,
 versions: '/api/lol/static-data/{region}/v1.2/versions?api_key=' + apiKey
 };

 function RiotAccess() {
 var self = this;

 self.pendingRequests = {};
 regions.forEach(function(region) {
 self.pendingRequests[region] = -1;
 });
 }

 RiotAccess.prototype = (function() {
 var prototype = {};


 prototype.requestApi = function(region, headers) {
 var self = this,
 deferred = q.defer();

 sleep(requestDelay * ++self.pendingRequests[region]).then(function() {
 self.pendingRequests[region]--;

 // Time it out if it takes too long.
 sleep(timeout).then(function() {
 if(deferred.promise.isPending()) {
 deferred.reject();
 }
 });

 var req = https.request(headers, function(res) {
 res.setEncoding('utf8');

 if(res.statusCode != 200) {
 deferred.reject();
 return;
 }

 var responseString = '';

 res.on('data', function(data) {
 responseString += data;
 });

 res.on('end', function() {
 try {
 deferred.resolve(JSON.parse(responseString));
 } catch(ex) {
 deferred.reject();
 }
 });
 });

 req.on('error', function() {
 deferred.reject();
 });

 req.end();
 });

 return deferred.promise;
 };

 prototype.requestUnthrottledApi = function(headers) {
 var deferred = q.defer();

 // Time it out if it takes too long.
 sleep(timeout).then(function() {
 deferred.reject();
 });

 var req = https.request(headers, function(res) {
 res.setEncoding('utf8');

 if(res.statusCode != 200) {
 deferred.reject();
 return;
 }

 var responseString = '';

 res.on('data', function(data) {
 responseString += data;
 });

 res.on('end', function() {
 try {
 deferred.resolve(JSON.parse(responseString));
 } catch(ex) {
 deferred.reject();
 }
 });
 });

 req.on('error', function() {
 deferred.reject();
 });

 req.end();

 return deferred.promise;
 };

 prototype.fetchMatchData = function() {
 var self = this;

 return q.async(function *() {
 // Basic algorithm:

 // A
 // CALL 1: Solo queue challenger.
 // WAIT FOR 1 TO COMPLETE

 // B
 // CALL 2: Team list challenger.
 // CALL 3: Team list master.
 // WAIT FOR 2 & 3 TO COMPLETE
 // Compile lists of teamIds - [teamInfoLimit] ids at a time.

 // C
 // CALL 4: Solo queue matchlist playerIds[0].
 // CALL 5: Solo queue matchlist playerIds[1].
 // ...
 // CALL M: Solo queue matchlist playerIds[playerIds.length-1].
 // WAIT FOR 4 - M TO COMPLETE

 // D
 // CALL M+1: Team info teamIdsLists[0].
 // CALL M+2: Team info teamIdsLists[1].
 // ...
 // CALL N: Team info teamIdsLists[teamIdsLists.length-1].
 // WIAT FOR M+1 - N TO COMPLETE

 // Compile list of matchIds.
 // Filter out any ids previously requested: db.any(record.matchId == matchId).

 // E
 // CALL N+1: Match info matchIds[0].
 // CALL N+2: Match info matchIds[1].
 // ...
 // CALL K: Match info matchIds[matchIds.length-1].
 // WAIT FOR N+1 - K TO COMPLETE
 // Store match info in database.

 var regionProcesses = [];

 for(var i = 0; i < regions.length; i++) {
 var region = regions[i],
 deferred = q.defer();

 q.async(function *() {
 // A
 var playerIds = yield q.async(function *() {
 var calls = [];

 var soloQueueTiers = ['challenger'];
 soloQueueTiers.forEach(function(tier) {
 calls.push({
 deferred: q.defer(),
 tier: tier
 });
 });

 calls.forEach(function(call) {
 self.requestApi(region, {
 host: host.replace(/{region}/g, region),
 path: soloListApi.replace(/{region}/g, region).replace(/{tier}/g, call.tier),
 method: 'GET',
 headers: {}
 }).then(function(league) {
 var playerIdList = [];

 league.entries.forEach(function(entry) {
 playerIdList.push(entry.playerOrTeamId);
 });

 call.deferred.resolve(playerIdList);
 }, function() {
 call.deferred.reject();
 });
 });

 return (yield q.allSettled(calls.map(function(call) {
 return call.deferred.promise;
 }))).filter(function(snapshot) {
 return snapshot.state === 'fulfilled';
 }).map(function(snapshot) {
 return snapshot.value;
 });
 })();

 playerIds = [].concat.apply([], playerIds);

 // B
 var teamIds = yield q.async(function *() {
 var calls = [];

 tiers.forEach(function(tier) {
 calls.push({
 deferred: q.defer(),
 tier: tier
 });
 });

 calls.forEach(function(call) {
 self.requestApi(region, {
 host: host.replace(/{region}/g, region),
 path: teamListApi.replace(/{region}/g, region).replace(/{tier}/g, call.tier),
 method: 'GET',
 headers: {}
 }).then(function(league) {
 var teamIds = [];

 league.entries.forEach(function(entry) {
 teamIds.push(entry.playerOrTeamId);
 });

 call.deferred.resolve(teamIds);
 }, function() {
 call.deferred.reject();
 });
 });

 return (yield q.allSettled(calls.map(function(call) {
 return call.deferred.promise;
 }))).filter(function(snapshot) {
 return snapshot.state === 'fulfilled';
 }).map(function(snapshot) {
 return snapshot.value;
 });
 })();

 teamIds = [].concat.apply([], teamIds);

 var teamIdLists = [],
 teamIdSubList = [];

 teamIds.forEach(function(teamId) {
 teamIdSubList.push(teamId);

 if(teamIdSubList.length === teamInfoLimit) {
 teamIdLists.push(teamIdSubList);
 teamIdSubList = [];
 }
 });

 if(teamIdSubList.length)
 teamIdLists.push(teamIdSubList);

 // C
 var soloMatchIds = yield q.async(function *() {
 var calls = [];

 playerIds.forEach(function(playerId) {
 calls.push({
 deferred: q.defer(),
 playerId: playerId
 });
 });

 calls.forEach(function(call) {
 self.requestApi(region, {
 host: host.replace(/{region}/g, region),
 path: matchListApi.replace(/{region}/g, region).replace(/{playerId}/g, call.playerId).replace(/{startTime}/g, (new Date()).getTime() - 1000 * 60 * 60 * 24 * 30),
 method: 'GET',
 headers: {}
 }).then(function(matchList) {
 var matchIdList = [];

 matchList.matches.forEach(function(match) {
 matchIdList.push(match.matchId);
 });

 call.deferred.resolve(matchIdList);
 }, function() {
 call.deferred.reject();
 });
 });

 return (yield q.allSettled(calls.map(function(call) {
 return call.deferred.promise;
 }))).filter(function(snapshot) {
 return snapshot.state === 'fulfilled';
 }).map(function(snapshot) {
 return snapshot.value;
 });
 })();

 soloMatchIds = [].concat.apply([], soloMatchIds);

 // D
 var teamMatchIds = yield q.async(function *() {
 var calls = [];

 teamIdLists.forEach(function(teamIdList) {
 calls.push({
 deferred: q.defer(),
 teamIdList: teamIdList
 });
 });

 calls.forEach(function(call) {
 self.requestApi(region, {
 host: host.replace(/{region}/g, region),
 path: teamInfoApi.replace(/{region}/g, region).replace(/{teamIdList}/g, call.teamIdList),
 method: 'GET',
 headers: {}
 }).then(function(teams) {
 var matchIdList = [];

 Object.keys(teams).forEach(function(teamId) {
 teams[teamId].matchHistory.forEach(function(match) {
 matchIdList.push(match.gameId);
 });
 });

 call.deferred.resolve(matchIdList);
 }, function() {
 call.deferred.reject();
 });
 });

 return (yield q.allSettled(calls.map(function(call) {
 return call.deferred.promise;
 }))).filter(function(snapshot) {
 return snapshot.state === 'fulfilled';
 }).map(function(snapshot) {
 return snapshot.value;
 });
 })();

 teamMatchIds = [].concat.apply([], teamMatchIds);

 var matchIds = soloMatchIds.concat(teamMatchIds);
 matchIds = matchIds.filter(function(matchId, j, arr) {
 return matchIds.indexOf(matchId) == j;
 });

 yield q.all(matchIds.map(function(matchId, j) {
 return db.collection('matches').count({matchId: matchId, region: region.toUpperCase()}).then(function(count) {
 if(count)
 matchIds[j] = -1;
 });
 })).then(function() {
 matchIds = matchIds.filter(function(matchId) {
 return matchId !== -1;
 });
 });

 if(matchIds.length > 200)
 matchIds = matchIds.slice(0, 200);

 // E
 var matches = yield q.async(function *() {
 var calls = [];

 matchIds.forEach(function(matchId) {
 calls.push({
 deferred: q.defer(),
 matchId: matchId
 });
 });

 calls.forEach(function(call) {
 self.requestApi(region, {
 host: host.replace(/{region}/g, region),
 path: matchInfoApi.replace(/{region}/g, region).replace(/{matchId}/g, call.matchId),
 method: 'GET',
 headers: {}
 }).then(function(match) {
 call.deferred.resolve(match);
 }, function() {
 call.deferred.reject();
 });
 });

 return (yield q.allSettled(calls.map(function(call) {
 return call.deferred.promise;
 }))).filter(function(snapshot) {
 return snapshot.state === 'fulfilled';
 }).map(function(snapshot) {
 return snapshot.value;
 });
 })();

 if(matches.length)
 yield db.collection('matches').insert(matches);

 })().then(function() {
 deferred.resolve();
 });

 regionProcesses.push(deferred.promise);
 }

 yield q.all(regionProcesses);
 })();
 };

 prototype.fetchStaticData = function(region) {
 var self = this;

 return q.async(function *() {
 // Only make api calls when:
 //     A. Latest patch changes (/api/lol/static-data/{region}/v1.2/versions).
 //     B. It has been over 3 days since the last set of calls (compensation for hotfixes).
 // Related Endpoints:
 //     /api/lol/static-data/{region}/v1.2/champion
 //     /api/lol/static-data/{region}/v1.2/item
 //     /api/lol/static-data/{region}/v1.2/map
 //     /api/lol/static-data/{region}/v1.2/mastery
 //     /api/lol/static-data/{region}/v1.2/rune
 //     /api/lol/static-data/{region}/v1.2/summoner-spell
 //     /api/lol/static-data/{region}/v1.2/versions

 yield q.async(function *() {
 var deferred = q.defer();

 self.requestUnthrottledApi({
 host: host.replace(/{region}/g, region),
 path: staticApi.champion.replace(/{region}/g, region),
 method: 'GET',
 headers: {}
 }).then(function(champions) {
 db.collection('champions').insert(utils.objValues(champions.data)).then(function() {
 deferred.resolve();
 });
 });

 return deferred.promise;
 })();

 yield q.async(function *() {
 var deferred = q.defer();

 yield self.requestUnthrottledApi({
 host: host.replace(/{region}/g, region),
 path: staticApi.item.replace(/{region}/g, region),
 method: 'GET',
 headers: {}
 }).then(function(items) {
 db.collection('items').insert(utils.objValues(items.data)).then(function() {
 deferred.resolve();
 });
 });

 return deferred.promise;
 })();

 yield q.async(function *() {
 var deferred = q.defer();

 yield self.requestUnthrottledApi({
 host: host.replace(/{region}/g, region),
 path: staticApi.map.replace(/{region}/g, region),
 method: 'GET',
 headers: {}
 }).then(function(maps) {
 db.collection('maps').insert(utils.objValues(maps.data)).then(function() {
 deferred.resolve();
 });
 });

 return deferred.promise;
 })();

 yield q.async(function *() {
 var deferred = q.defer();

 yield self.requestUnthrottledApi({
 host: host.replace(/{region}/g, region),
 path: staticApi.mastery.replace(/{region}/g, region),
 method: 'GET',
 headers: {}
 }).then(function(masteries) {
 db.collection('masteries').insert(utils.objValues(masteries.data)).then(function() {
 deferred.resolve();
 });
 });

 return deferred.promise;
 })();

 yield q.async(function *() {
 var deferred = q.defer();

 yield self.requestUnthrottledApi({
 host: host.replace(/{region}/g, region),
 path: staticApi.rune.replace(/{region}/g, region),
 method: 'GET',
 headers: {}
 }).then(function(runes) {
 db.collection('runes').insert(utils.objValues(runes.data)).then(function() {
 deferred.resolve();
 });
 });

 return deferred.promise;
 })();

 yield q.async(function *() {
 var deferred = q.defer();

 yield self.requestUnthrottledApi({
 host: host.replace(/{region}/g, region),
 path: staticApi.summonerSpell.replace(/{region}/g, region),
 method: 'GET',
 headers: {}
 }).then(function(summonerSpells) {
 db.collection('summonerSpells').insert(utils.objValues(summonerSpells.data)).then(function() {
 deferred.resolve();
 });
 });

 return deferred.promise;
 })();

 yield q.async(function *() {
 var deferred = q.defer();

 yield self.requestUnthrottledApi({
 host: host.replace(/{region}/g, region),
 path: staticApi.versions.replace(/{region}/g, region),
 method: 'GET',
 headers: {}
 }).then(function(versions) {
 // Convert string[] to object[] with definition { version: <value> }
 versions = versions.map(function(version) {
 return {version: version};
 });
 db.collection('versions').insert(versions).then(function() {
 deferred.resolve();
 });
 });

 return deferred.promise;
 })();
 })();
 };


 return prototype;
 })();

 module.exports = RiotAccess;

 })();
 */