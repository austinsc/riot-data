import _ from 'lodash';
import prettyjson from 'prettyjson';

export function isInteger(value) {
  return +value === (value | 0);
}

export function isArrayOfIntegers(array) {
  return _.isArray(array) && _.every(array, isInteger);
}

export function isArrayOfStrings(array) {
  return _.isArray(array) && _.every(array, _.isString);
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

export function print(data) {
  console.log(prettyjson.render(data));
  return data;
}