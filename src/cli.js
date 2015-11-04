import rc from 'rc';
import optimist from 'optimist';
import Logdown from 'logdown';
import {region, apikey, mongodb} from './defaults';
import RiotAccess from './riot';

const argv = optimist
  .usage('Run the data mining service.')
  .describe('r', 'Region to mine').alias('r', 'region')
  .describe('k', 'Riot API key').alias('k', 'apikey')
  .describe('m', 'MongoDB connection string').alias('m', 'mongodb')
  .argv;

const config = rc('riot-data', {region, apikey, mongodb, logger: new Logdown({prefix: 'riot-data'})}, argv);

var rito = new RiotAccess(config);
rito.start()
  .then(() => process.exit(0))
  .catch(err => {
    config.logger.error(err);
    process.exit(0);
  });
