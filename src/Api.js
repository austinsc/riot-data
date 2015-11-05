import http from 'http';
import https from 'https';
import _ from 'lodash';
import redis from 'redis';
import RateLimiter from './RateLimiter';
import {isInteger, fillUri} from './utilities';
import * as api from './api/index';
import * as defaults from './defaults';



export default class Api {
  constructor(options = {}) {
    options = _.defaults(options, defaults);
    if(!options.apikey || !_.isString(options.apikey)) {
      throw new Error('Invalid API key: ' + apikey);
    }
    this._apikey = options.apikey;
    this._limiterPer10s = new RateLimiter(options.limitPer10s, 10 * 1000);
    this._limiterPer10min = new RateLimiter(options.limitPer10min, 10 * 60 * 1000);
    this._cacheTTL = options.cacheTTL;
    if(this._useRedis = options.useRedis) {
      if(options.port && options.host) {
        this._redisClient = redis.createClient.apply(this, arguments);
      } else {
        this._redisClient = redis.createClient();
      }
    }

    _.keys(api).forEach(a => this[a] = _.mapValues(api[a], (v, k) => _.wrap(v, (x, ...args) => this.exec(_.defaults(x(...args), options)))));
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
    console.log('requesting...');
    if(!options.uri || !_.isString(options.uri)) {
      return new Promise((resolve, reject) => reject(new Error('Invalid URI: ' + options.uri)));
    }

    if(options.static) {
      return this._get(options);
    } else {
      console.log('scheduling...');
      return new Promise((resolve, reject) =>
        this.schedule((done) => {
          console.log('scheduled!');
          this._get(options).then(...args => {
            if(done) {
              done();
            }
            resolve(...args);
          }, reject);
        })
      );
    }
  }

  schedule(fn) {
    this._limiterPer10s.schedule((done1) => {
      this._limiterPer10min.schedule((done2) => {
        fn(function() {
          if(done1) {
            done1();
          }
          if(done2) {
            done2();
          }
        });
      });
    });
  }

  _get(options) {
    console.log('getting...');
    return new Promise((resolve, reject) => {
      const protocol = options.useHttp ? http : https;
      let data = '';

      protocol.get(options.uri, function(response) {
        const contentType = response.headers['content-type'];
        response.on('data', chunk => data += chunk);
        response.on('error', error => reject(error));
        response.on('end', () => {
          if(contentType.indexOf('application/json') === -1) {
            reject(response.statusCode + ' API failed to return JSON content');
            return;
          }

          if(!data) {
            resolve(null);
            return;
          }

          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch(error) {
            reject('Unable to parse data received from the server');
            return;
          }

          if(parsed.status && parsed.status.message !== 200) {
            reject(`${parsed.status.status_code} ${parsed.status.message}`);
          } else {
            resolve(parsed);
          }
        });
      });
    });
  }
}
