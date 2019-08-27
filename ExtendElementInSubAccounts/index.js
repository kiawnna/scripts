require('dotenv').config()
const axios = require('axios');
const uuid = require('uuid/v4');
const { baseUrl, headers, logError } = require('./util.js');
const payload = require('./payload.json');

const getAccounts = async (token) => {
  let url = `https://${baseUrl()}/elements/api-v2/accounts`;
  if (token) {
    url = `${url}&nextPage=${token}`;
  }

  try {
    const res = await axios.get(url, {
      headers: headers()
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

    if (res && res.status === 200 && res.headers["elements-next-page-token"]) {
      nextPageToken = res.headers["elements-next-page-token"]
    } else {
      keepGoing = false;
    }
  }

  return results;
}

const getUserPayload = () => {
  return {
    "firstName": "API",
    "lastName": "User",
    "email": `ExtendElementInSubAccount+${uuid()}@${process.env.EMAIL_DOMAIN}`,
    "password": uuid(),
    "roles": [{"key": "admin"}]
  };
}

const createUsers = async (accounts) => await Promise.all(accounts.map(a => createUser(a.id)));
const createUser = async (accountId) => {
  try {
    const res = await axios.post(
      `https://${baseUrl()}/elements/api-v2/accounts/${accountId}/users`,
      getUserPayload(),
      { headers: headers() }
    );
    if (res.status == 200) return res.data
  } catch (e) {
    logError(e);
  }
}

const extendElements = async (users) => await Promise.all(users.map(u => extendElement(u)));
const extendElement = async (user) => {
  try {
    const res = await axios.post(
      `https://${baseUrl()}/elements/api-v2/elements/${process.env.ELEMENT_KEY}/resources`,
      payload,
      { headers: headers(user.secret) }
    );
    if (res.status == 200) return res.data
  } catch (e) {
    logError(e);
  }
};

const deleteUsers = async (users) => await Promise.all(users.map(u => deleteUser(u)));
const deleteUser = async (user) => {
  try {
    const res = await axios.delete(`https://${baseUrl()}/elements/api-v2/organizations/users/${user.id}`, { headers: headers() });
    if (res.status == 200) return res
  } catch (e) {
    logError(e);
  }
}

const start = async () => {
  console.log(`INFO: running script in ${process.env.MODE} mode.`);
  
  const accounts = await getAllAccounts();
  console.log(`INFO: found ${acounts.length} account(s).`);
  
  if (process.env.MODE === "CREATE") {
    const users = await createUsers(accounts);
    console.log(`INFO: created ${users.filter(u => u).length} users(s).`);
    
    const elements = await extendElements(users);
    console.log(`INFO: extended ${elements.filter(e => e).length} elements(s).`);
    
    const deletedUsers = await deleteUsers(users);
    console.log(`INFO: cleaned up ${deletedUsers.filter(u => u).length} user(s).`);
  }
};

start();
