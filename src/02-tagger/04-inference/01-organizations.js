let orgWords = require('./data/orgWords')

//could this word be an organization
const maybeOrg = function(t) {
  //must be a noun
  if (!t.tags.Noun) {
    return false
  }
  //can't be these things
  if (t.tags.Pronoun || t.tags.Comma || t.tags.Possessive) {
    return false
  }
  //must be one of these
  if (t.tags.TitleCase || t.tags.Organization || t.tags.Acronym || t.tags.Place) {
    return true
  }
  return false
}

const tagOrgs = function(doc, termArr) {
  termArr.forEach(terms => {
    for (let i = 0; i < terms.length; i += 1) {
      let t = terms[i]
      if (orgWords[t.clean] !== undefined && orgWords.hasOwnProperty(t.clean) === true) {
        // look-backward - eg. 'Toronto University'
        let lastTerm = terms[i - 1]
        if (lastTerm !== undefined && maybeOrg(lastTerm) === true) {
          lastTerm.tagSafe('Organization', 'org-word-1', doc.world)
          t.tagSafe('Organization', 'org-word-2', doc.world)
          continue
        }
        //look-forward - eg. University of Toronto
        let nextTerm = terms[i + 1]
        if (nextTerm !== undefined && nextTerm.clean === 'of') {
          if (terms[i + 2] && maybeOrg(terms[i + 2])) {
            t.tagSafe('Organization', 'org-of-word-1', doc.world)
            nextTerm.tagSafe('Organization', 'org-of-word-2', doc.world)
            terms[i + 2].tagSafe('Organization', 'org-of-word-3', doc.world)
            continue
          }
        }
      }
    }
  })

  return doc
}
module.exports = tagOrgs
