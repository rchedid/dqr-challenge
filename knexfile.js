module.exports = {
  dev: {
    client: 'pg',
    version: '14.2',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'pass',
      database: 'dqr-challenge-dev',
    },
    migrations: { directory: 'src/migrations' },
    // seeds: { directory: 'src/seeds' },
  },
  prod: {
    client: 'pg',
    version: '14.2',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'pass',
      database: 'dqr-challenge-prod',
    },
    migrations: { directory: 'src/migrations' },
  },
};
