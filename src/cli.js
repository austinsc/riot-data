import q from 'q';
import rc from 'rc';
import optimist from 'optimist';
import {region, apikey, mongodb} from './defaults';
import RiotAccess from './riot';

const argv = optimist
  .usage('Run the data mining service.')
  .describe('r', 'Region to mine').alias('r', 'region')
  .describe('k', 'Riot API key').alias('k', 'apikey')
  .describe('m', 'MongoDB connection string').alias('m', 'mongodb')
  .argv;

const config = rc('riot-data', {region, apikey, mongodb}, argv);

var rito = new RiotAccess(config);
rito.start()
  .then(() => process.exit(0));

//q.async(function *() {
//  var riotAccess = new RiotAccess();
//  yield riotAccess.initDatabase();
//  yield riotAccess.fetchMatchData();
//})()
//  .then(() => {
//  process.exit(0);
//})
//  .catch(err => {
//    console.log('ERROR');
//    console.dir(err);
//    process.exit(0);
//  });