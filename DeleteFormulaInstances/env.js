const { getEnv } = require('./helpers');

const checkEnv = () => {
  const env = getEnv();

  for (const key in env) {
    if (env.hasOwnProperty(key) && isInvalid(env[key])) {
      console.error(`ERROR: expected value for ${key} in .env, got null or undefined.`);
      process.exit(1);
    }
  }

  if (doesNotInclude(['STAGING', 'US_PROD', 'EU_PROD'], env.ceEnv)) {
    console.error(`ERROR: expected value for CE_ENV in .env to be one of the following: 'STAGING', 'US_PROD', 'EU_PROD', but found ${env.ceEnv}.`);
    process.exit(1);
  }

  if (doesNotInclude(['GET', 'DELETE'], env.mode)) {
    console.error(`ERROR: expected value for MODE in .env to be one of the following: 'GET', 'CREATE', 'DELETE', but found ${env.mode}.`);
    process.exit(1);
  }

  env.templateIds.forEach(id => {
    if (isNaN(id)) {
      console.error(`ERROR: expected value for formula template ID in .env to be integer, but found ${id}.`);
      process.exit(1);
    }
  });
};

// -- Private --
const isInvalid = (v) => v == null || v == undefined;
const doesNotInclude = (list, val) => !list.includes(val);

module.exports = { checkEnv };