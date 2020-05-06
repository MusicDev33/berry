class Processor {
  constructor(domain, options) {
    // domain must be in format subdomain.domain.toplevel (www.reddit.com)
    this.domain = domain;
    this.options = options;

    this.checks = [this.domainProcess];

    if (options.httpsOnly) {
      this.checks.push(this.httpsProcess);
    } else {
      this.checks.push(this.httpProcess);
    }
  }

  process = (link) => {
    if (link.startsWith('/')) {
      return this.domain + link;
    }

    for (let i = 0; i < this.checks.length; i++) {
      const result = this.checks[i](link);
      if (!result) {
        return false;
      }
    }

    return link;
  }

  httpsProcess = (link) => {
    if (link.includes('https://')) {
      return true;
    }
    return false;
  }

  httpProcess = (link) => {
    if (link.includes('http://') || link.includes('https://')) {
      return true;
    }
    return false;
  }

  domainProcess = (link) => {
    if (link.includes(this.domain)) {
      return true;
    }
    return false;
  }
}

module.exports = Processor;
