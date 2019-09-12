const axios = require('axios');
const { baseUrl, headers, logError } = require('./util.js');
const resource = require('./resource.json');

const create = async (users) => {
  const elements = await extendElements(users);
    
  return {
    action: 'extended',
    object: 'element',
    count: elements.filter(e => e).length
  };
};

const extendElements = async (users) => await Promise.all(users.map(u => extendElement(u)));
const extendElement = async (user) => {
  try {
    const res = await axios.post(
      `https://${baseUrl()}/elements/api-v2/elements/${process.env.ELEMENT_KEY}/resources`,
      resource, {
        headers: headers(user.secret)
      }
    );
    if (res.status == 200) return true;
  } catch (e) {
    logError(e);
  }
};

module.exports = { create };