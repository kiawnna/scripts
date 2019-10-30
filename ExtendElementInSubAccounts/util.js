const axios = require('axios');
const uuid = require('uuid/v4');
const dotenv = require('dotenv');
const https = require('https');

const agent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false
});

const headers = (userSecret = process.env.USER_SECRET) => {
  return {
    'Authorization': `User ${userSecret}, Organization ${process.env.ORG_SECRET}`,
    'content-type': 'application/json'
  };
};

const baseUrl = () => {
  switch (process.env.CE_ENV) {
    case 'STAGING':
      return 'staging.cloud-elements.com';
    case 'US_PROD':
      return 'api.cloud-elements.com';
    case 'EU_PROD':
      return 'api.cloud-elements.co.uk';
  }
};

const logInfo = (action, object, quantity) => console.log(`INFO: ${action} ${quantity} ${object}(s).`);

const logError = (e) => {
  if (e.response && e.response.data && e.response.data.message && e.response.data.requestId) {
    console.error(`ERROR: ${e.response.data.message}, requestId: ${e.response.data.requestId}`);
  } else {
    console.error(e);
  }
};

const getAccounts = async (token) => {
  let url = `https://${baseUrl()}/elements/api-v2/accounts`;
  if (token) {
    url = `${url}&nextPage=${token}`;
  }

  try {
    const res = await axios.get(url, {
      headers: headers(),
      httpsAgent: agent
    });
    return res;
  } catch (e) {
    logError(e);
  }
};

const getAllAccounts = async () => {
  let results = [];
  let keepGoing = true;
  let nextPageToken;

  while (keepGoing) {
    let res = await getAccounts(nextPageToken);

    if (res && res.status === 200) {
      await results.push.apply(results, res.data);
    }

    if (res && res.status === 200 && res.headers['elements-next-page-token']) {
      nextPageToken = res.headers['elements-next-page-token']
    } else {
      keepGoing = false;
    }
  }

  return results;
};

const userPayload = () => {
  return {
    'firstName': 'API',
    'lastName': 'User',
    'email': `ExtendElementInSubAccount+${uuid()}@${process.env.EMAIL_DOMAIN}`,
    'password': uuid(),
    'roles': [{
      'key': 'admin'
    }]
  };
};

const createUsers = async (accounts) => await Promise.all(accounts.map(a => createUser(a.id)));
const createUser = async (accountId) => {
  try {
    const res = await axios.post(
      `https://${baseUrl()}/elements/api-v2/accounts/${accountId}/users`,
      userPayload(), {
        headers: headers(),
        httpsAgent: agent
      }
    );
    if (res.status == 200) return res.data;
  } catch (e) {
    logError(e);
  }
};

const deleteUsers = async (users) => await Promise.all(users.map(u => deleteUser(u)));
const deleteUser = async (user) => {
  try {
    const res = await axios.delete(`https://${baseUrl()}/elements/api-v2/organizations/users/${user.id}`, {
      headers: headers(),
      httpsAgent: agent
    });
    if (res.status == 200) return res;
  } catch (e) {
    logError(e);
  }
};

const isInvalid = (v) => v == null || v == undefined;
const doesNotInclude = (list, val) => !list.includes(val);

const envAssert = () => {
  const env = dotenv.config().parsed;

  for (const key in env) {
    if (env.hasOwnProperty(key) && isInvalid(env[key])) {
      logError(`ERROR: expected value for ${key} in .env, got null or undefined.`);
      process.exit(1);
    }
  }

  if (doesNotInclude(['STAGING', 'US_PROD', 'EU_PROD'], env.CE_ENV)) {
    logError(`ERROR: expected value for CE_ENV in .env to be one of the following: 'STAGING', 'US_PROD', 'EU_PROD', but found ${env.CE_ENV}.`);
    process.exit(1);
  }

  if (doesNotInclude(['GET', 'CREATE', 'DELETE'], env.MODE)) {
    logError(`ERROR: expected value for MODE in .env to be one of the following: 'GET', 'CREATE', 'DELETE', but found ${env.MODE}.`);
    process.exit(1);
  }
};

module.exports = { headers, baseUrl, logInfo, logError, getAllAccounts, createUsers, deleteUsers, envAssert };