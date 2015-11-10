import _ from 'lodash';
import Q from 'q';
import https from 'https';
import mongodb from 'mongodb';
import Api from './Api';
import {inspect} from 'util';
import {print} from './utilities';

export default class RiotAccess extends Api {
  constructor(config) {
    super(config);
    this.mongodb = config.mongodb;
    this.logger = config.logger;
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

  async start() {
    this.logger.info('Initializing the database...');
    await this.initDatabase();

    this.logger.info('Retrieving the challenger league teams...');
    const teams = await this.League.getChallenger('RANKED_TEAM_5x5');

    console.dir(teams);
    for(let entry in teams.entries) {
      this.logger.info(`Retrieving the team data for *${entry.playerOrTeamId}*...`);
      const team = await this.Team.get(entry.playerOrTeamId);
      for(let record in team.matchHistory) {
        const match = await this.Match.get(record.gameId, {includeTimeline: true});
        await this.database.collection('matches').insert(match);
        print(match);
      }
    }
  }

  stop() {

  }
}
