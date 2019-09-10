const axios = require('axios');
const { baseUrl, headers, logInfo, logError } = require('./util.js');
const resource = require('./resource.json');

const del = async (users) => {
  const toDelete = await getResources(users)
  const resources = await deleteResources(toDelete);

  return {
    action: 'deleted',
    object: 'resource',
    count: resources.filter(r => r).length
  };
};

const getResources = async (users) => await Promise.all(users.map(u => getResource(u)));
const getResource = async (user) => {
  try {
    const res = await axios.get(
      `https://${baseUrl()}/elements/api-v2/elements/${process.env.ELEMENT_KEY}/resources?accountOnly=true`, {
        headers: headers(user.secret)
      }
    );
    if (res.status == 200) {
      const rx = res.data.filter(r => r.path === resource.path && r.method === resource.method);
      return { res: rx[0], user };
    }
  } catch (e) {
    logError(e);
  }
};

const deleteResources = async (data) => await Promise.all(data.map(d => deleteResource(d.res.id, d.user)));
const deleteResource = async (id, user) => {
  try {
    const res = await axios.delete(
      `https://${baseUrl()}/elements/api-v2/elements/${process.env.ELEMENT_KEY}/resources/${id}`, {
        headers: headers(user.secret)
      }
    );
    if (res.status == 200) return true;
  } catch (e) {
    e.response.status == 404
      ? logInfo('found', 'undeletable GA resource', 1)
      : logError(e);
  }
};

module.exports = { del };