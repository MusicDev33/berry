const Crawler = require('crawler')
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Processor = require('./link.processor');
const processor = new Processor('www.reddit.com', {httpsOnly: true});

const Link = require('./link.model');

mongoose.connect('mongodb://localhost:27017/asdevtest', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connection.on('connected', () => {
  console.log('Database Connected: ' + 'mongodb://localhost:27017/asdevtest');
});

mongoose.connection.on('error', (err) => {
  console.log('Database Error: ' + err);
});

let mode = 'question';

let totalLinks = [];
// let visitedLinks = [];

const test = processor.process('https://www.reddit.com/r/java/comments/dp2275/how_to_build_openjdk_from_source/');
console.log(test);

const crawler = new Crawler({
  maxConnections: 1,
  rateLimit: 250,
  callback: async (error, res, done) => {
    if (error) {
      console.log(error);
    } else {
      // $ is Cheerio
      const $ = res.$;

      $('a').get().map(element => $(element).attr('href')).forEach(link => {
        const processedLink = processor.process(link);
        if (processedLink) {
          const saveLink = Link({ href: 'https://www.reddit.com' + link });
          await foundLink = Link.findOne({href: link});
          if (foundLink) {
            done();
          }
        }
      });
    }
  }
});

/*
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
                  const saveLink = Link({
                    href: 'https://www.reddit.com' + link
                  });

                  Link.findOne({href: link}, (err, doc) => {
                    if (doc) {
                      done();
                    } else {
                      saveLink.save((err) => {
                        console.log(totalLinks.length);
                        const link = totalLinks[0];
                        totalLinks.shift();

                        newCrawl(link);
                      });
                    }
                  });

                  saveLink.save((err) => {
                    console.log(totalLinks.length);
                    const link = totalLinks[0];
                    totalLinks.shift();
                    totalLinks.push('https://www.reddit.com' + link)
                    newCrawl(link);
                  });
                }
              } else {
                if (link && !totalLinks.includes(link) && link.includes('www.reddit')) {
                  const saveLink = Link({
                    href: link
                  });

                  Link.findOne({href: link}, (err, doc) => {
                    if (doc) {
                      done();
                    } else {
                      saveLink.save((err) => {
                        console.log(totalLinks.length);
                        const link = totalLinks[0];
                        totalLinks.shift();
                        totalLinks.push('https://www.reddit.com' + link);
                        newCrawl(link);
                      });
                    }
                  });
                }
              }
            });
            // totalLinks = links.concat($('a').get().map(element => $(element).attr("href")));
            // const comments = $('a._1qeIAgB0cPwnLhDF9XSiJM').get().map(element => $(element).text());
        }
    }
});

function newCrawl(link) {
  if (link.includes('https://')) {
    crawl.queue(link);
  } else if (link.includes('http://')) {
    console.log('Error: HTTP not supported');
    crawl.queue(httpRemover());
  } else {
    crawl.queue('https://www.reddit.com' + link);
  }
}

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
*/
