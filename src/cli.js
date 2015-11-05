import rc from 'rc';
import optimist from 'optimist';
import Logdown from 'logdown';
import cfonts from 'cfonts';
import * as defaults from './defaults';
import RiotAccess, {print} from './riot';

var fonts = new cfonts({
  'text': 'riot-data', //text to be converted
  'font': 'block', //define the font face
  'colors': '', //define all colors
  'background': 'Black', //define the background color
  'letterSpacing': 1, //define letter spacing
  'space': true, //define if the output text should have empty lines on top and on the bottom
  'maxLength': '9' //define how many character can be on one line
});

const argv = optimist
  .usage('Run the data mining service.')
  .describe('r', 'Region to mine').alias('r', 'region')
  .describe('k', 'Riot API key').alias('k', 'apikey')
  .describe('m', 'MongoDB connection string').alias('m', 'mongodb')
  .argv;

const config = rc('riot-data', {...defaults, logger: new Logdown({prefix: 'riot-data'})}, argv);

var rito = new RiotAccess(config);
rito.start()
  .then(print)
  .then(() => process.exit(0))
  .catch(err => {
    config.logger.error(err.stack || err);

    process.exit(0);
  });
