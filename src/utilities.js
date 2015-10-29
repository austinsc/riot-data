(function () {
  "use strict";

  var utils = {};

  /**
   * Object
   */

  utils.set = function (obj, prop, value) {
    if (typeof prop === 'string')
      prop = prop.split('.');

    if (prop.length > 1) {
      var elem = prop.shift();
      utils.set(obj[elem] = (Object.prototype.toString.call(obj[elem])) === '[object Object]' ? obj[elem] : {}, prop, value);
    } else {
      obj[prop[0]] = value;
    }
  };

  utils.get = function (obj, prop) {
    if (!obj)
      return;

    var result = obj,
      i = 0,
      props = prop.split('.'),
      len = props.length;

    for (; i < len; i++) {
      if (typeof (result) === 'object' && props[i] in result)
        result = result[props[i]];
      else
        return;
    }

    return result;
  };

  utils.objValues = function (obj) {
    var objValues = [];

    Object.keys(obj).forEach(function (key) {
      objValues.push(obj[key]);
    });

    return objValues;
  };

  /**
   * Array
   */

  utils.aggregate = function (arr, fn, seed) {
    if (!arr.length)
      return seed;

    var aggr = seed !== undefined ? fn(seed, arr[0]) : arr[0];
    for (var i = 1; i < arr.length; i++) {
      aggr = fn(aggr, arr[i]);
    }

    return aggr;
  };

  /**
   * String
   */

    // https://en.wikipedia.org/wiki/Letter_case#Special_case_styles
  utils.spinalCase = function (str) {
    if (typeof str !== 'string' || !str.length)
      return str;

    str = str.toLowerCase();
    str = str.replace(/[^\w\s]/ig, '');
    str = str.replace(/\s+/g, ' ');
    str = str.trim();
    str = str.replace(/ /g, '-');

    return str;
  };

  utils.truncate = function (str, len, ellipses) {
    if (typeof str !== 'string' || !str.length || str.length <= len)
      return str;

    str = str.substring(0, len);
    if (ellipses)
      str += '...';

    return str;
  };

  utils.capitalize = function (str) {
    return str.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
  };

  utils.clean = function (str) {
    if (!str || typeof str !== 'string')
      return str;

    return str.trim().toLowerCase().replace(/\W/g, '');
  };

  utils.hasCleanMatch = function (str, query) {
    if (!str || typeof str !== 'string' || !query || typeof query !== 'string')
      return false;

    var cleanedStr = utils.clean(str),
      cleanedQuery = utils.clean(query);

    if (!cleanedStr.length || !cleanedQuery.length) return false;
    return cleanedStr.indexOf(cleanedQuery) > -1;
  };

  module.exports = utils;

})();

export function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}