const QuickBooks = require('node-quickbooks');

const qboface = {
  initialize(options) {
    this.consumerKey = options.consumerKey;
    this.consumerSecret = options.consumerSecret;
    this.enableSandbox = options.enableSandbox;
    this.enableDebug = options.enableDebug;
  },

  factory(credentials) {
    const {
      oauthToken,
      oauthTokenSecret,
      realmId,
    } = credentials;

    if (!oauthToken) {
      throw new Error('missing oauthToken');
    }

    if (!oauthTokenSecret) {
      throw new Error('missing oauthTokenSecret');
    }

    if (!realmId) {
      throw new Error('missing realmId');
    }

    const instance = new QuickBooks(
      this.consumerKey,
      this.consumerSecret,
      oauthToken,
      oauthTokenSecret,
      realmId,
      this.enableSandbox,
      this.enableDebug
    );

    return instance;
  },

  // Read data from the Quickbooks API
  read(method, credentials) {
    const qbo = this.factory(credentials);

    return new Promise((resolve, reject) => {
      if (!qbo[method]) {
        return reject('method not found');
      }

      // getPreferences has a different signature, taking only the callback as
      // a single argument
      if (method === 'getPreferences') {
        return qbo[method]((error, response) => {
          if (error) {
            return reject(error);
          }

          return resolve(response);
        });
      }

      return qbo[method](credentials.realmId, (error, response) => {
        if (error) {
          return reject(error);
        }

        return resolve(response);
      });
    });
  },

  // Create data in Quickbooks
  create(method, payload, credentials) {
    const qbo = this.factory(credentials);

    return new Promise((resolve, reject) => {
      if (!qbo[method]) {
        return reject('method not found');
      }

      return qbo[method](payload, (error, response) => {
        if (error) {
          return reject(error);
        }

        return resolve(response);
      });
    });
  },

  // Update data in Quickbooks
  update(method, payload, credentials) {
    const qbo = this.factory(credentials);

    return new Promise((resolve, reject) => {
      if (!qbo[method]) {
        return reject('method not found');
      }

      return qbo[method](payload, (error, response) => {
        if (error) {
          return reject(error);
        }

        return resolve(response);
      });
    });
  },

  // Query for data from the Quickbooks API
  query(method, criteria, credentials) {
    const qbo = this.factory(credentials);

    return new Promise((resolve, reject) => {
      if (!qbo[method]) {
        reject('method not found');
        return;
      }

      qbo[method](criteria, (error, response) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(response.QueryResponse);
      });
    });
  },

  // Get report data from the Quickbooks API
  report(method, options, credentials) {
    const qbo = this.factory(credentials);

    return new Promise((resolve, reject) => {
      if (!qbo[method]) {
        reject('method not found');
        return;
      }

      qbo[method](options, (error, response) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(response);
      });
    });
  },
};

module.exports = qboface;
