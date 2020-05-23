const TERM_RE = /\[(\w+(\|\w+)?)\]/g;
const PRONOUNS = {
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
export default ((template, terms, preferredPronoun) => {
  let result = '';
  let lastIndex = 0;
  let match;

  if (preferredPronoun && preferredPronoun in PRONOUNS) {
    terms = { ...PRONOUNS[preferredPronoun],
      ...terms
    };
  }

  while ((match = TERM_RE.exec(template)) !== null) {
    result += template.substring(lastIndex, match.index);
    const term = match[1].toLowerCase();
    let val;
    let index;

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

    if (term !== match[1]) {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }

    result += val;
    lastIndex = match.index + match[0].length;
  }

  result += template.substring(lastIndex);
  return result;
});
