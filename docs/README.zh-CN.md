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
[codecov-url]: https://codecov.io/github/Mitscherlich/koa2-session-mongo?branch=dev
[david-image]: https://img.shields.io/david/Mitscherlich/koa2-session-mongo.svg?style=flat-square
[david-url]: https://david-dm.org/Mitscherlich/koa2-session-mongo
[snyk-image]: https://snyk.io/test/npm/koa2-session-mongo/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/koa2-session-mongo
[download-image]: https://img.shields.io/npm/dm/koa2-session-mongo.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa2-session-mongo

基于 [connect-mongo](https://github.com/jdesboeufs/connect-mongo) 的 [Koa session middleware](https://github.com/hiddentao/koa-session-store) MongoDB 外部储存。

这个仓库克隆自 [hiddentao/Koa session middleware](https://github.com/hiddentao/koa-session-store)，详见原仓库关于早期版本的兼容性。

## 兼容性

- 支持 Koa `2.x`
- 支持 [Mongoose](http://mongoosejs.com/index.html) `>= 4.1.2+`
- 支持 [native MongoDB driver](http://mongodb.github.io/node-mongodb-native/) `>= 2.0.36`
- 支持 Node.js 4, 6, 8
- 支持 [MongoDB](https://www.mongodb.com/) `>= 3.0`

更多兼容性详情，参见早期版本。

## 安装

```bash
# for npm
npm install --save koa2-session-mongo
# for yarn
yarn add koa2-session-mongo
```

## 使用说明

### Koa ver2

Koa `2.x`:

```js
const session = require("koa-session-store");

const MongoStore = require("koa2-session-mongo");
const Koa = require("koa");

const app = new Koa();

app.keys = ["some secret key"]; // cookie-signing 需要

app.use(
  session({
    store: new MongoStore({
      url: "mongodb://127.0.0.1", // 必需
      db: "database_name", // 必需
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

### 连接到 MongoDB

通常情况下, `koa2-session-mongo` 并不是你的应用中唯一需要连接到 MongoDB 数据库的中间件。那么能够重用已有数据库连接将很有意义。

同样，你也可以为 `koa2-sesion-mongo` 配置一个新链接.

#### 重用 MongoDB 数据库链接

```js
const mongoose = require("mongoose");

// 基本
mongoose.connect(connectionOptions);

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

// 高级
const connection = mongoose.createConnection(connectionOptions);

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: connection,
    }),
  })
);
```

#### 重用一个原生 MongoDB 驱动 (或是 promise)

在这种情形下，为 `koa2-sesion-mongo` 配置 `db` 属性。
如果是一个没有打开的连接, `koa-session-store` 将自动为你建立连接。

```js
/*
 ** 通常由多种方式连接数据库
 ** 参照你的数据库 API Referencs
 */

app.use(
  session({
    store: new MongoStore({ db: dbInstance }),
  })
);
```

或是一个 promise...

```js
app.use(
  session({
    store: new MongoStore({ dbPromise: dbInstancePromise }),
  })
);
```

#### 从 MongoDB URI 创建一个新链接

[MongoDB connection strings](http://docs.mongodb.org/manual/reference/connection-string/) 是官方推荐的**最佳方法**来配置一个新连接。参见 [more options](http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options) 来了解在 `mongoOptions` 可配置的更多属性.

```js
// 基本
app.use(
  session({
    store: new MongoStore({ url: "mongodb://localhost/test-app" }),
  })
);

// 高级
app.use(
  session({
    store: new MongoStore({
      url:
        "mongodb://user12345:foobar@localhost/test-app?authSource=admins&w=1",
      mongoOptions: advancedOptions, // 请参考官网 API 使用
    }),
  })
);
```

## 选项

下面是构建对象是可以传入的参数：

- **db** `String` 或 `Object` - 数据库名或连接实例 [node-mongo-native](https://github.com/mongodb/node-mongodb-native)。
- **collection** `String` - 文档集合名. 默认是 _sessions_.
- **auto_reconnect** `Boolean` - 传入 [node-mongo-native](https://github.com/mongodb/node-mongodb-native) 构造器的参数。默认为 _false_.
- **ssl** `Boolean` - 是否使用 SSL。默认为 _false_.
- **expirationTime** `Number` - time-to-live (TTL) session 超时时间 - MongoDB 将自动删除在这个时间内未更新的文档。默认为两周。
- **url** `String` - 形如 `mongodb://user:pass@host:port/database/collection` 的 MongoDB URI。**将覆盖如 `mongoose` 之类的复用数据库选项**.
- **mongoose** `Object` - 一个已有的 [Mongoose](https://github.com/LearnBoost/mongoose) 使用 `mongoose.connection` 以获取。

## License

[MIT](LICENSE)
