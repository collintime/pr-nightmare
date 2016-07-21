'use strict'

const Hoek = require('hoek')
const Nightmare = require('nightmare')
const Config = require('./config')
const Promise = require('bluebird')

let internals = {
  nightmareConfig: {
    show: true
  },
  siteDefaults: {
    keywords: [],
    wait: 1000
  },
  configDefaults: {
    wait: 1000,
    keywords: [],
    sites: []
  }
}

let search = (site) => {

  let base = Nightmare()
    .goto(site.url)
    .wait(site.wait)

  if (site.load_more) {

    let repeat = site.load_more.repeat || 1
    let loadMoreWait = site.load_more.wait || 1000

    for (let i = 0; i < repeat; ++i) {
      base.click(site.load_more.selector).wait(loadMoreWait)
    }
  }

  return base.evaluate(function (config) {

    let results = []

    config.selector.forEach(s => {
      let thumbs = document.querySelectorAll(s)
      let thumbsArray = Array.from(thumbs)
      results = results.concat(thumbsArray.map(a => a.innerText))
    })

    return results

  }, site)
    .then(function (results) {

      let searchResults = { url: site.url, results: {} }

      site.keywords.forEach(k => {

        searchResults.results[k] = results.filter(r => r.toLowerCase().indexOf(k.toLowerCase()) > -1)
      })

      return searchResults
    })
    .catch(function (error) {

      console.error('Search failed:', error);
    });
}


let run = (sourceConfig) => {

  let config = Hoek.applyToDefaults(internals.configDefaults, sourceConfig)

  config.sites.forEach((site, index) => {
    config.sites[index].wait = site.wait || config.wait
    config.sites[index] = Hoek.applyToDefaults(internals.siteDefaults, site);
    config.sites[index].keywords = config.sites[index].keywords.concat(config.keywords)
  })

  let promises = config.sites.map(s => search(s))

  Promise.all(promises)
    .then(results => {

      console.log(JSON.stringify(results))
    })
}

run(Config)