import PromiseMaker from './PromiseMaker';
import _ from 'lodash';
import redis from 'redis';
import {RateLimit} from 'ratelimit.js';
import {isInteger, fillUri, print} from './utilities';
import * as api from './api/index';
import * as defaults from './defaults';
import request from 'superagent';


export default class Api {
  constructor(options = {}) {
    options = _.defaults(options, defaults);
    if(!options.apikey || !_.isString(options.apikey)) {
      throw new Error('Invalid API key: ' + apikey);
    }
    this._logger = options.logger;
    this._apikey = options.apikey;
    this._region = options.region;
    _.keys(api).forEach(a => this[a] = _.mapValues(api[a], (v, k) => _.wrap(v, (x, ...args) => this.exec(_.defaults(x(...args), options)))));

    const client = redis.createClient();
    const rules = [
      {interval: 10 * 60 * 1000, limit: options.limitPer10min},
      {interval: 10 * 1000, limit: options.limitPer10s}
    ];
    this._limiter = new RateLimit(client, rules, {prefix: 'RiotAPI'})
  }

  exec(options) {
    try {
      options.uri = this.craftUri(options);
    } catch(error) {
      return new Promise((resolve, reject) => reject(error));
    }

    return this.request(options);
  }

  craftUri(options) {
    if(!options) {
      throw new Error('Options missing');
    }
    if(!options.region || typeof options.region !== 'string') {
      throw new Error('Invalid region: ' + options.region);
    }
    if(!options.uri || typeof options.uri !== 'string') {
      throw new Error('Invalid API URI: ' + options.uri);
    }

    const host = options.host || 'https://' + (options.static ? 'global' : options.region) + '.' + options.endpoint;
    return `${host}${fillUri(options)}?api_key=${this._apikey}${_.map(options.query, (v, k) => `&${k}=${v}`)}`;
  }

  request(options) {
    this._logger.info(`requesting...`);
    print(options);

    if(!options.uri || !_.isString(options.uri)) {
      return new Promise((resolve, reject) => reject(new Error('Invalid URI: ' + options.uri)));
    }

    if(options.static) {
      return this._get(options);
    } else {
      return this.schedule(this._get.bind(this, options));
    }
  }

  schedule(fn) {
    return new Promise((resolve, reject) => {
      const rateLimitWrapper = (err, isRateLimited) => {
        if(err) {
          this._logger.error('Error: ' + err);
          reject(err);
        }
        if(isRateLimited) {
          return this.schedule(fn);
        } else {
          resolve(fn());
        }
      };
      this._limiter.incr(this._region, 1, rateLimitWrapper);
    });
  }

  _get(options) {
    this._logger.log('getting');
    return request.get(options.uri)
      .use(PromiseMaker)
      .promise();
  }

  //_get(options) {
  //  return new Promise((resolve, reject) => {
  //    const protocol = options.useHttp ? http : https;
  //    let data = '';
  //
  //    protocol.get(options.uri, function(response) {
  //      const contentType = response.headers['content-type'];
  //      response.on('data', chunk => data += chunk);
  //      response.on('error', error => reject(error));
  //      response.on('end', () => {
  //        if(contentType.indexOf('application/json') === -1) {
  //          reject(response.statusCode + ' API failed to return JSON content');
  //          return;
  //        }
  //        try {
  //          resolve(JSON.parse(data));
  //        } catch(error) {
  //          reject('Unable to parse data received from the server');
  //        }
  //      });
  //    });
  //  });
  //}
}
