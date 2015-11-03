import config from '../config';
import {exec} from '../util';

export default function(region) {
  return {
    getChampions(options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATIC_CHAMPION;
      options.static = true;
      options.query = {
        locale: options.locale || null,
        version: options.version || null,
        dataById: options.dataById || null,
        champData: options.champData instanceof Array ? options.champData.join() : options.champData || null
      };

      return exec(options);
    },

    getChampion(championId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATIC_CHAMPION_ID;
      options.id = championId;
      options.static = true;
      options.query = {
        locale: options.locale || null,
        version: options.version || null,
        champData: options.champData instanceof Array ? options.champData.join() : options.champData || null
      };

      return exec(options);
    },

    getItems(options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATIC_ITEM;
      options.static = true;
      options.query = {
        locale: options.locale || null,
        version: options.version || null,
        itemListData: options.itemListData instanceof Array ? options.itemListData.join() : options.itemListData || null
      };

      return exec(options);
    },

    getItem(itemId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATIC_ITEM_ID;
      options.id = itemId;
      options.static = true;
      options.query = {
        locale: options.locale || null,
        version: options.version || null,
        itemData: options.itemData instanceof Array ? options.itemData.join() : options.itemData || null
      };

      return exec(options);
    },

    getMasteries(options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATIC_MASTERY;
      options.static = true;
      options.query = {
        locale: options.locale || null,
        version: options.version || null,
        masteryListData: options.masteryListData instanceof Array ? options.masteryListData.join() : options.masteryListData || null
      };

      return exec(options);
    },

    getMastery(masteryId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATIC_MASTERY_ID;
      options.id = masteryId;
      options.static = true;
      options.query = {
        locale: options.locale || null,
        version: options.version || null,
        masteryData: options.masteryData instanceof Array ? options.masteryData.join() : options.masteryData || null
      };

      return exec(options);
    },

    getRunes(options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATIC_RUNE;
      options.static = true;
      options.query = {
        locale: options.locale || null,
        version: options.version || null,
        runeListData: options.runeListData instanceof Array ? options.runeListData.join() : options.runeListData || null
      };

      return exec(options);
    },

    getRune(runeId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATIC_RUNE_ID;
      options.id = runeId;
      options.static = true;
      options.query = {
        locale: options.locale || null,
        version: options.version || null,
        runeData: options.runeData instanceof Array ? options.runeData.join() : options.runeData || null
      };

      return exec(options);
    },

    getSummonerSpells(options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATIC_SUMMONER_SPELL;
      options.static = true;
      options.query = {
        locale: options.locale || null,
        version: options.version || null,
        dataById: options.dataById || null,
        spellData: options.spellData instanceof Array ? options.spellData.join() : options.spellData || null
      };

      return exec(options);
    },

    getSummonerSpell(summonerSpellId, options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATIC_SUMMONER_SPELL_ID;
      options.id = summonerSpellId;
      options.static = true;
      options.query = {
        locale: options.locale || null,
        version: options.version || null,
        spellData: options.spellData instanceof Array ? options.spellData.join() : options.spellData || null
      };

      return exec(options);
    },

    getRealm(options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATIC_REALM;
      options.static = true;

      return exec(options);
    },

    getVersions(options) {
      options = options || {};
      options.region = options.region || region || config.defaultRegion;
      options.uri = config.uri.STATIC_VERSIONS;
      options.static = true;

      return exec(options);
    }
  };
};