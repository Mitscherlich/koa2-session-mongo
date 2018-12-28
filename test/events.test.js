/* eslint-disable */
'use strict';

const expect = require('expect.js');
const MongoStore = require('..');

const futureDate = new Date(2030, 1);
const connectionString = process.env.MONGODB_URL || 'mongodb://localhost:27017/test';

const noop = () => {/* noop */};

describe('test/events.test.js', () => {
  let store, collection;

  beforeEach((done) => {
    store = new MongoStore({
      url: connectionString,
      db: 'test',
      collection: 'sessions',
      mongoOptions: {
        useNewUrlParser: true,
      }
    });

    store.once('connected', () => {
      collection = store.collection;
      collection.removeMany({}, done);
    });
  });

  afterEach(() => {
    store.close();
  });

  describe('set() with an unknown session id', () => {
    it('should emit a `create` event', (done) => {
      store.once('create', (sid) => {
        expect(sid).to.be('foo1');
        done();
      });
      store.set('foo1', { foo: 'bar' }, noop);
    });
    it('should emit a `set` event', (done) => {
      store.once('set', (sid) => {
        expect(sid).to.be('foo2');
        done();
      });
      store.set('foo2', { foo: 'bar' }, noop);
    });
  });

  describe('set() with a session id associated to an existing session', () => {
    it('should emit an `update` event', (done) => {
      store.once('update', (sid) => {
        expect(sid).to.be('foo3');
        done();
      });
      collection.insertOne({ _id: 'foo3', session: { foo: 'bar1' }, expires: futureDate }, (err) => {
        expect(err).not.to.be.ok();
        store.set('foo3', { foo: 'bar2' }, noop);
      });
    });
    it('should emit an `set` event', (done) => {
      store.once('update', (sid) => {
        expect(sid).to.be('foo4');
        done();
      });
      collection.insertOne({ _id: 'foo4', session: { foo: 'bar1' }, expires: futureDate }, (err) => {
        expect(err).not.to.be.ok();
        store.set('foo4', { foo: 'bar2' }, noop);
      });
    });
  });
});
