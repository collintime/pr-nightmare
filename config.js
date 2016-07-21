

module.exports = {
  keywords: ['gun'],
  wait: 2000,
  sites: [{
    url: 'http://www.chalkbeat.org/co/',
    selector: ['.thumb-title'],
    keywords: ['safety', 'aurora superintendent'],
    load_more: {
      selector: '.load-more-recent',
      wait: 1000,
      repeat: 2
    }
  }, {
      url: 'http://www.aurorasentinel.com/',
      selector: ['.module-story']
    }]
}