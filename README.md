# koa2-session-mongo

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/koa2-session-mongo.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa2-session-mongo
[travis-image]: https://img.shields.io/travis/Mitscherlich/koa2-session-mongo.svg?style=flat-square
[travis-url]: https://travis-ci.org/Mitscherlich/koa2-session-mongo
[codecov-image]: https://img.shields.io/codecov/c/github/Mitscherlich/koa2-session-mongo.svg?style=flat-square
[codecov-url]: https://codecov.io/github/Mitscherlich/koa2-session-mongo?branch=master
[david-image]: https://img.shields.io/david/Mitscherlich/koa2-session-mongo.svg?style=flat-square
[david-url]: https://david-dm.org/Mitscherlich/koa2-session-mongo
[snyk-image]: https://snyk.io/test/npm/koa2-session-mongo/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/koa2-session-mongo
[download-image]: https://img.shields.io/npm/dm/koa2-session-mongo.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa2-session-mongo

MongoDB session store for [Koa session middleware](https://github.com/hiddentao/koa-session-store). Based on [connect-mongo](https://github.com/jdesboeufs/connect-mongo).

This repo is forked from [hiddentao/Koa session middleware](https://github.com/hiddentao/koa-session-store). Go origin repository see preview version.

See Chinses version: [中文](docs/README.zh-CN.md)

## Compatibility

- Support Koa up to `2.x`
- Support [Mongoose](http://mongoosejs.com/index.html) `>= 4.1.2+`
- Support [native MongoDB driver](http://mongodb.github.io/node-mongodb-native/) `>= 2.0.36`
- Support Node.js 8 and 10 (**`async`** keyword required)
- Support [MongoDB](https://www.mongodb.com/) `>= 3.0`

For extended compatibility, see previous versions.

## Installation

```bash
# for npm
npm install --save koa2-session-mongo
# for yarn
yarn add koa2-session-mongo
```

## Usage

### Koa integration

Koa `2.x`:

```js
const session = require("koa-session-store");

const MongoStore = require("koa2-session-mongo");
const Koa = require("koa");

const app = new Koa();

app.keys = ["some secret key"]; // needed for cookie-signing

app.use(
  session({
    store: new MongoStore({
      url: "mongodb://127.0.0.1", // requierd
      db: "database_name", // required
    }),
  })
);

app.use(async (ctx) => {
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  ctx.body = n + " views";
});

app.listen(3000);
console.log("listening on port 3000");
```

### Connection to MongoDB

In many circumstances, `koa2-session-mongo` will not be the only part of your application which need a connection to a MongoDB database. It could be interesting to re-use an existing connection.

Alternatively, you can configure `koa2-session-mongo` to establish a new connection.

#### Re-use a Mongoose connection

```js
const mongoose = require("mongoose");

// Basic usage
mongoose.connect(connectionOptions);

app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Advanced usage
const connection = mongoose.createConnection(connectionOptions);

app.use(
  session({
    store: new MongoStore({ mongooseConnection: connection }),
  })
);
```

#### Re-use a native MongoDB driver connection (or a promise)

In this case, you just have to give your `db` instance to `koa2-session-mongo`.
If the connection is not opened, `koa2-session-mongo` will do it for you.

```js
/*
 ** There are many ways to create dbInstance.
 ** You should refer to the driver documentation.
 */

app.use(
  session({
    store: new MongoStore({ db: dbInstance }),
  })
);
```

Or just give a promise...

```js
app.use(
  session({
    store: new MongoStore({ dbPromise: dbInstancePromise }),
  })
);
```

#### Create a new connection from a MongoDB connection string

[MongoDB connection strings](http://docs.mongodb.org/manual/reference/connection-string/) are **the best way** to configure a new connection. For advanced usage, [more options](http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options) can be configured with `mongoOptions` property.

```js
// Basic usage
app.use(
  session({
    store: new MongoStore({ url: "mongodb://localhost/test-app" }),
  })
);

// Advanced usage
app.use(
  session({
    store: new MongoStore({
      url:
        "mongodb://user12345:foobar@localhost/test-app?authSource=admins&w=1",
      mongoOptions: advancedOptions, // See below for details
    }),
  })
);
```

## Options

The following configuration options are available for the `new` call:

- **db** `String` or `Object` - db name or instantiated [node-mongo-native](https://github.com/mongodb/node-mongodb-native) db object.
- **collection** `String` - collection name. Default is _sessions_.
- **auto_reconnect** `Boolean` - gets passed to the [node-mongo-native](https://github.com/mongodb/node-mongodb-native) constructor as the same option. Default is _false_.
- **ssl** `Boolean` - use ssl to connect to the server. Default is _false_.
- **expirationTime** `Number` - time-to-live (TTL) in seconds for any given session data - MongoDB will auto-delete data which hasn't been updated for this amount of time. Default is 2 weeks.
- **url** `String` - connection URL of the form `mongodb://user:pass@host:port/database/collection`. **If provided then this will take precedence over other options except `mongoose`**.
- **mongoose** `Object` - a [Mongoose](https://github.com/LearnBoost/mongoose) connection, use\*\* `mongoose.connection` to get the connection out of an existing Mongoose object. If provided then this will take precedence over other options.

## License

[MIT](LICENSE)
