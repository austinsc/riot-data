import _ from 'lodash';
import http from 'http';
import https from 'https';
import config from './config';
import RateLimiter from './rateLimiter';
import redis from 'redis';


var _apiKey = null;
var _limiterPer10s;
var _limiterPer10min;
var _useRedis = false;
var _cacheTTL = config.defaultTTL;
var _redisClient;

export function isInteger(value) {
  return +value === (value | 0);
}

export function enableRedis(port, host, options = {}) {
  if(!_useRedis && redis.createClient) {
    if(port && host) {
      _redisClient = redis.createClient.apply(this, arguments);
    } else {
      _redisClient = redis.createClient();
    }
    _useRedis = true;
  }
}

export function setCacheTTL(timeout) {
  _cacheTTL = timeout;
}

export function isArrayOfIntegers(array) {
  return _.isArray(array) && _.every(array, isInteger);
}

export function isArrayOfStrings(array) {
  return _.isArray(array) && _.every(array, _.isString);
}

export function setApiKey(apiKey) {
  if(!apiKey || typeof apiKey !== 'string') {
    throw new Error('Invalid API key: ' + apiKey);
  }
  _apiKey = apiKey;
}

export function setDefaultRateLimit() {
  _limiterPer10s = new RateLimiter(config.defaultLimitPer10s, 10 * 1000);
  _limiterPer10min = new RateLimiter(config.defaultLimitPer10min, 10 * 60 * 1000);
}

export function setRateLimit(limitPer10s, limitPer10min) {
  if(!limitPer10s || !isInteger(limitPer10s)) {
    throw new Error('Invalid limit per 10 seconds: ' + limitPer10s);
  }
  if(!limitPer10min || !isInteger(limitPer10min)) {
    throw new Error('Invalid limit per 10 minutes: ' + limitPer10min);
  }

  _limiterPer10s = new RateLimiter(limitPer10s, 10 * 1000);
  _limiterPer10min = new RateLimiter(limitPer10min, 10 * 60 * 1000);
}

export function exec(options) {
  try {
    options.uri = craftUri(options);
  } catch(error) {
    return new Promise((resolve, reject) => reject(error));
  }

  return request(options);
}

export function fillUri(options) {
  const pattern = new RegExp('\\{(?:(\\w+):)?(\\w+)\\}', 'gi');
  let result = pattern.exec(options.uri);
  while(result) {
    const needle = result[0];
    const param = result[result.length - 1];

    if(!options[param]) {
      throw new Error('Param ' + param + ' was not provided');
    }
    if(result.length === 3) {
      const type = result[1];
      switch(type) {
        case 'string':
          if(typeof options[param] !== 'string' && !isArrayOfStrings(options[param])) {
            throw new Error('Param ' + param + ' must be string or an array of strings');
          }
          break;
        case 'int':
          if(!isInteger(options[param]) && !isArrayOfIntegers(options[param])) {
            throw new Error('Param ' + param + ' must be an integer or an array of integers');
          }
          break;
      }
      if(options[param] instanceof Array) {
        options[param] = options[param].join();
      }
    }
    result = pattern.exec(options.uri);
    options.uri = options.uri.replace(needle, options[param]);
  }

  return options.uri;
}

export function craftUri(options) {
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
  return `${host}${fillUri(options)}?api_key=${_apiKey}${_.map(options.query, (v, k) => `&${k}=${v}`)}`;
}

export function request(options) {
  return new Promise((resolve, reject) => {
    if(!options.uri || typeof options.uri !== 'string') {
      reject(new Error('Invalid URI: ' + options.uri));
    }

    if(_useRedis) {
      _redisClient.get(options.uri, function(error, results) {
        if(!error && results) {
          try {
            return resolve(JSON.parse(results));
          } catch(err) {
            _redisClient.del(options.uri);
            return reject(err);
          }
        }
        if(options.static) {
          return _get(options);
        } else {
          schedule(function(done) {
            _get(options, function() {
              if(done) {
                done();
              }
              resolve.apply(this, arguments);
            });
          });
        }
      });
    } else {
      if(options.static) {
        return _get(options);
      } else {
        schedule(function(done) {
          _get(options, function() {
            if(done) {
              done();
            }
            callback.apply(this, arguments);
          });
        });
      }
    }
  });
}

export function schedule(fn) {
  _limiterPer10s.schedule(function(done1) {
    _limiterPer10min.schedule(function(done2) {
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

export function _get(options) {
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
          if(_useRedis || options.cacheRequest) {
            redis.set(options.uri, data);
            _redisClient.expire(options.uri, _cacheTTL);
          }

          return resolve(parsed);
        }
      });
    });
  });
}


