import {
  STATIC_CHAMPION,
  STATIC_CHAMPION_ID,
  STATIC_ITEM,
  STATIC_ITEM_ID,
  STATIC_MASTERY,
  STATIC_MASTERY_ID,
  STATIC_RUNE,
  STATIC_RUNE_ID,
  STATIC_SUMMONER_SPELL,
  STATIC_SUMMONER_SPELL_ID,
  STATIC_REALM,
  STATIC_VERSIONS
} from '../../Constants';

export const Static = {
  getChampions(options = {}) {
    return Object.assign({}, options, {
      uri: STATIC_CHAMPION,
      static: true,
      query: {
        locale: options.locale || null,
        version: options.version || null,
        dataById: options.dataById || null,
        champData: options.champData instanceof Array ? options.champData.join() : options.champData || null
      }
    });
  },

  getChampion(championId, options = {}) {
    return Object.assign({}, options, {
      id: championId,
      uri: STATIC_CHAMPION,
      static: true,
      query: {
        locale: options.locale || null,
        version: options.version || null,
        champData: options.champData instanceof Array ? options.champData.join() : options.champData || null
      }
    });
  },

  getItems(options = {}) {
    return Object.assign({}, options, {
      uri: STATIC_ITEM,
      static: true,
      query: {
        locale: options.locale || null,
        version: options.version || null,
        itemListData: options.itemListData instanceof Array ? options.itemListData.join() : options.itemListData || null
      }
    });
  },

  getItem(itemId, options = {}) {
    return Object.assign({}, options, {
      id: itemId,
      uri: STATIC_ITEM_ID,
      static: true,
      query: {
        locale: options.locale || null,
        version: options.version || null,
        itemData: options.itemData instanceof Array ? options.itemData.join() : options.itemData || null
      }
    });
  },

  getMasteries(options = {}) {
    return Object.assign({}, options, {
      uri: STATIC_MASTERY,
      static: true,
      query: {
        locale: options.locale || null,
        version: options.version || null,
        masteryListData: options.masteryListData instanceof Array ? options.masteryListData.join() : options.masteryListData || null
      }
    });
  },

  getMastery(masteryId, options = {}) {
    return Object.assign({}, options, {
      id: masteryId,
      uri: STATIC_MASTERY_ID,
      static: true,
      query: {
        locale: options.locale || null,
        version: options.version || null,
        masteryData: options.masteryData instanceof Array ? options.masteryData.join() : options.masteryData || null
      }
    });
  },

  getRunes(options = {}) {
    return Object.assign({}, options, {
      uri: STATIC_RUNE,
      static: true,
      query: {
        locale: options.locale || null,
        version: options.version || null,
        runeListData: options.runeListData instanceof Array ? options.runeListData.join() : options.runeListData || null
      }
    });
  },

  getRune(runeId, options = {}) {
    return Object.assign({}, options, {
      id: runeId,
      uri: STATIC_RUNE_ID,
      static: true,
      query: {
        locale: options.locale || null,
        version: options.version || null,
        runeData: options.runeData instanceof Array ? options.runeData.join() : options.runeData || null
      }
    });
  },

  getSummonerSpells(options = {}) {
    return Object.assign({}, options, {
      uri: STATIC_SUMMONER_SPELL,
      static: true,
      query: {
        locale: options.locale || null,
        version: options.version || null,
        spellData: options.spellData instanceof Array ? options.spellData.join() : options.spellData || null
      }
    });
  },

  getSummonerSpell(summonerSpellId, options = {}) {
    return Object.assign({}, options, {
      id: summonerSpellId,
      uri: STATIC_SUMMONER_SPELL_ID,
      static: true,
      query: {
        locale: options.locale || null,
        version: options.version || null,
        dataById: options.dataById || null,
        spellData: options.spellData instanceof Array ? options.spellData.join() : options.spellData || null
      }
    });
  },

  getRealm(options = {}) {
    return Object.assign({}, options, {
      uri: STATIC_REALM,
      static: true
    });
  },

  getVersions(options = {}) {
    return Object.assign({}, options, {
      uri: STATIC_VERSIONS,
      static: true
    });
  }
};