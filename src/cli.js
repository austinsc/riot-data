import q from 'q';
import rc from 'rc';
import optimist from 'optimist';
import defaults from './defaults';
import RiotAccess from './riot';

const argv = optimist
  .usage('Count the lines in a file.\nUsage: $0')
  .describe('f', 'Load a file').alias('f', 'file')
  .argv;

const config = rc('riot-data', defaults, argv);

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