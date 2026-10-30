const { MongoClient } = require('mongodb');

const DB_NAME = process.env.MONGODB_DB || 'mycoin';

// Em serverless a mesma instância atende várias requisições: a conexão fica em
// cache no global para não abrir um pool novo a cada invocação.
const cache = global.__mycoinMongo || (global.__mycoinMongo = { client: null, promise: null });

async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI não configurada');

  if (cache.client) return cache.client.db(DB_NAME);

  if (!cache.promise) {
    cache.promise = MongoClient.connect(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    })
      .then(async client => {
        cache.client = client;
        await ensureIndexes(client.db(DB_NAME));
        return client;
      })
      .catch(err => {
        cache.promise = null;
        throw err;
      });
  }

  const client = await cache.promise;
  return client.db(DB_NAME);
}

async function ensureIndexes(db) {
  await Promise.all([
    db.collection('users').createIndex({ username: 1 }, { unique: true }),
    db.collection('states').createIndex({ userId: 1 }, { unique: true }),
  ]);
}

const users = async () => (await getDb()).collection('users');
const states = async () => (await getDb()).collection('states');

module.exports = { getDb, users, states };
