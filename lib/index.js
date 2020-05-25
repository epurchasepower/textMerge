"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TERM_RE = /\[(\w+(\|\w+)?)\]/g;
var PRONOUNS = {
  he: {
    they: 'he',
    them: 'him',
    their: 'his',
    theirs: 'his'
  },
  she: {
    they: 'she',
    them: 'her',
    their: 'her',
    theirs: 'hers'
  },
  they: {
    they: 'they',
    them: 'them',
    their: 'their',
    theirs: 'theirs'
  }
};
/*
 * Someday we'll allow the user to pass in a locale, and we'll have
 *  style options keyed by part of the merge term, like [value:currency]
 *  or [value:scientific].
 * For now, everyone is US, with commas and 3 significant digits
 */

var defaultFormatter = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 3
});

var formatNumber = function formatNumber(val) {
  return defaultFormatter.format(val);
};

var _default = function _default(template, terms, preferredPronoun) {
  var result = '';
  var lastIndex = 0;
  var match;

  if (preferredPronoun && preferredPronoun in PRONOUNS) {
    terms = _objectSpread(_objectSpread({}, PRONOUNS[preferredPronoun]), terms);
  }

  while ((match = TERM_RE.exec(template)) !== null) {
    result += template.substring(lastIndex, match.index);
    var term = match[1].toLowerCase();
    var val = void 0;
    var index = void 0;

    if (term in terms) {
      val = terms[term];
    } else if (preferredPronoun && (index = term.indexOf('|')) > 0) {
      if (preferredPronoun === 'they') {
        val = term.substring(0, index);
      } else {
        val = term.substring(index + 1);
      }
    } else {
      val = match[0];
    }

    if (typeof val === 'number') {
      val = formatNumber(val);
    } else if (term !== match[1]) {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }

    result += val;
    lastIndex = match.index + match[0].length;
  }

  result += template.substring(lastIndex);
  return result;
};

exports["default"] = _default;
