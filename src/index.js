import numbro from 'numbro'

const TERM_RE = /\[(\w+(\/\w+)?)\]/g
const PRONOUNS = {
  i: {
    they: 'I',
    them: 'me',
    their: 'my',
    theirs: 'mine',
    themselves: 'myself',
  },
  he: {
    they: 'he',
    them: 'him',
    their: 'his',
    theirs: 'his',
    themselves: 'himself',
  },
  she: {
    they: 'she',
    them: 'her',
    their: 'her',
    theirs: 'hers',
    themselves: 'herself',
  },
  they: {
    they: 'they',
    them: 'them',
    their: 'their',
    theirs: 'theirs',
    themselves: 'themselves',
  },
  we: {
    they: 'we',
    them: 'us',
    their: 'our',
    theirs: 'ours',
    themselves: 'ourselves',
  },
}

/*
 * Someday we'll allow the user to pass in a locale, and we'll have
 *  style options keyed by part of the merge term, like [value:currency]
 *  or [value:scientific].
 * For now, everyone is US, with commas and 2 digits after the decimal point
 */

const formatNumber = (val) =>
  numbro(val).format({thousandSeparated: true, mantissa: 2, optionalMantissa: true})

export default (template, terms, preferredPronoun,missing) => {
  let result = ''
  let lastIndex = 0
  let match
  if (preferredPronoun && preferredPronoun in PRONOUNS) {
    terms = {
      ...PRONOUNS[preferredPronoun],
      ...terms,
    }
  }

  while ((match = TERM_RE.exec(template)) !== null) {
    result += template.substring(lastIndex, match.index)
    let term = match[1].charAt(0).toLowerCase() + match[1].substring(1)
    if (!(term in terms)) {
      term = match[1]
    }
    let val
    let index
    if (term in terms) {
      val = terms[term]
    } else if (preferredPronoun && (index = term.indexOf('/')) > 0) {
      if (preferredPronoun === 'they' || preferredPronoun === 'we') {
        val = term.substring(0, index)
      } else {
        val = term.substring(index + 1)
      }
    } else {
      val = match[0]
        if (missing){
        missing.push(term)
      }
    }
    if (typeof val === 'number') {
      val = formatNumber(val)
    } else if (term !== match[1]) {
      val = val.charAt(0).toUpperCase() + val.slice(1)
    }
    result += val
    lastIndex = match.index + match[0].length
  }
  result += template.substring(lastIndex)

  return result
}
