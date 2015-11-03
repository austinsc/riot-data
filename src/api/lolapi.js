import _ from 'lodash';
import redis from 'redis';
import config from './config';
import RateLimiter from './rateLimiter';
import {isInteger, fillUri} from '../utilities';
import * as api from './api/index';


export default class Api {
  constructor(options = {}) {
    options = _.merge(config, options);
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

    _.keys(api).forEach(a => this[a] = _.mapValues(api[a], (v, k) => _.wrap(v, (x, ...args) => this.exec(_.merge(x(...args), {region: options.region})))));
  }

  exec(options) {
    try {
      console.log(options.uri = this.craftUri(options));
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

    var endpoint = options.endpoint || config.endpoint;
    var host = options.host || 'https://' + (options.static ? 'global' : options.region) + '.' + endpoint;
    return `${host}${fillUri(options)}?api_key=${this._apikey}${_.map(options.query, (v, k) => `&${k}=${v}`)}`;
  }

  request(options) {
    return new Promise((resolve, reject) => {
      if(!options.uri || typeof options.uri !== 'string') {
        return reject(new Error('Invalid URI: ' + options.uri));
      }

      if(this._useRedis) {
        this._redisClient.get(options.uri, (error, results) => {
          if(!error && results) {
            try {
              return resolve(JSON.parse(results));
            } catch(err) {
              this._redisClient.del(options.uri);
              return reject(err);
            }
          }
          if(options.static) {
            this._get(options).then(resolve, reject);
          } else {
            this.schedule((done) => {
              this._get(options).then(...args => {
                if(done){
                  done();
                }
                resolve(...args);
              }, reject);
            });
          }
        });
      } else {
        if(options.static) {
          this._get(options).then(resolve, reject);
        } else {
          this.schedule((done) => {
            this._get(options).then(...args => {
              if(done){
                done();
              }
              resolve(...args);
            }, reject);
          });
        }
      }
    });
  }

  schedule(fn) {
    this._limiterPer10s.schedule(function(done1) {
      this._limiterPer10min.schedule(function(done2) {
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
    return new Promise((resolve, reject) => {
      const protocol = options.useHttp ? http : https;
      let data = '';

      protocol.get(options.uri, function(response) {
        const contentType = response.headers['content-type'];

        response.on('data', function(chunk) {
          data += chunk;
        });

        response.on('error', function(error) {
          reject(error);
        });

        response.on('end', function() {
          if(contentType.indexOf('application/json') === -1) {
            return reject(response.statusCode + ' API failed to return JSON content');
          }

          if(!data) {
            return resolve(null);
          }

          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch(error) {
            return reject('Unable to parse data received from the server');
          }

          if(parsed.status && parsed.status.message !== 200) {
            return reject(`${parsed.status.status_code} ${parsed.status.message}`);
          } else {
            if(this._useRedis || options.cacheRequest) {
              redis.set(options.uri, data);
              this._redisClient.expire(options.uri, this._cacheTTL);
            }

            return resolve(parsed);
          }
        });
      });
    });
  }
}
