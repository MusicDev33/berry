const Crawler = require('crawler')
const cheerio = require('cheerio');

let mode = 'question';

let totalLinks = [];
// let visitedLinks = [];

const crawl = new Crawler({
    maxConnections: 1,
    rateLimit: 250,
    // This will be called for each crawled page
    callback: (error, res, done) => {
        if (error){
            console.log(error);
        } else {
            const $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server

            // console.log($("h3._eYtD2XCVieq6emjKBH3m").get().map(element => $(element).text()));
            // console.log($("a._3ryJoIoycVkA88fy40qNJc").get().map(element => $(element).attr("href")));
            // console.log($("a.SQnoC3ObvgnGjWt90zD9Z._2INHSNB8V5eaWp4P0rY_mE").get().map(element => $(element).attr("href")));
            // console.log($('a._3BFvyrImF3et_ZF21Xd8SC').get().map(element => $(element).attr("href")));
            // console.log($('a').get().map(element => $(element).attr("href")));
            const links = $('a._3BFvyrImF3et_ZF21Xd8SC').get().map(element => $(element).attr("href"));
            // totalLinks = links.concat(totalLinks);
            $('a').get().map(element => $(element).attr("href")).forEach(link => {

              if (link && link.startsWith('/')) {
                if (!totalLinks.includes('https://www.reddit.com' + link)) {
                  totalLinks.push('https://www.reddit.com' + link)
                }
              } else {
                if (link && !totalLinks.includes(link) && link.includes('www.reddit')) {
                  totalLinks.push(link);
                }
              }
            });
            // totalLinks = links.concat($('a').get().map(element => $(element).attr("href")));
            const comments = $('a._1qeIAgB0cPwnLhDF9XSiJM').get().map(element => $(element).text());
            // console.log(comments[0]);
            console.log(totalLinks);
            const link = totalLinks[0];
            totalLinks.shift();

            if (link.includes('https://')) {
              crawl.queue(link);
            } else if (link.includes('http://')) {
              console.log('Error: HTTP not supported');
              crawl.queue(httpRemover());
            } else {
              crawl.queue('https://www.reddit.com' + link);
            }
        }
        done();
    }
});

function httpRemover() {
  if (totalLinks[0].includes('http://')) {
    totalLinks.shift();
    return httpRemover();
  } else if (!totalLinks[0].includes('reddit')) {
    totalLinks.shift();
    return httpRemover();
  }
  return totalLinks;
}

crawl.queue('https://www.reddit.com/');
