/*
  CAUTION: Running this script will delete formula instances as defined in readme.md, this action is permanent.
*/

require('dotenv').config();
const axios = require('axios');
const { headers, baseUrl, getEnv } = require('./helpers');

const getInstances = async (templateId, token) => {
  const { ceEnv, userSecret, orgSecret } = getEnv();

  let url = `https://${baseUrl(ceEnv)}/elements/api-v2/formulas/${templateId}/instances`;
  if (token) {
    url = `${url}&nextPage=${token}`;
  }

  try {
    const res = await axios.get(url, { headers: headers(userSecret, orgSecret), timeout: 5000 });
    return res;
  } catch (e) {
    console.error(e);
  }
};

const getPagedInstances = async (templateId) => {
  let results = [];
  let keepGoing = true;
  let nextPageToken;

  while (keepGoing) {
    let res = await getInstances(templateId, nextPageToken);

    if (res && res.status === 200) { await results.push.apply(results, res.data.map(d => d.id)); }

    if (res && res.status === 200 && res.headers["elements-next-page-token"]) {
      nextPageToken = res.headers["elements-next-page-token"]
    } else {
      keepGoing = false;
    }
  }

  return { templateId, results: results.flat() };
};

const getAllInstances = async () => {
  const { templateIds } = getEnv();
  return Promise.all(templateIds.map(t => getPagedInstances(t)));
}

const deleteInstances = async (templateId, instanceIds) => instanceIds.map(i => deleteInstance(templateId, i));

const deleteInstance = async (templateId, instanceId) => {
  const { ceEnv, userSecret, orgSecret } = getEnv();

  try {
    await axios.delete(`https://${baseUrl(ceEnv)}/elements/api-v2/formulas/${templateId}/instances/${instanceId}`, {
      headers: headers(userSecret, orgSecret)
    });
  } catch (e) {
    console.error(`Error: ${e.response.data.message}, requestId: ${e.response.data.requestId}`);
  }
};

const deleteAllInstances = async (templates) => Promise.all(templates.map(async (t) => {
  const res = await deleteInstances(t.templateId, t.results);
  return {templateId: t.templateId, results: res};
}));

const start = async () => {
  const { mode, ceEnv } = getEnv();
  console.log(`INFO: running script in ${mode} mode for Cloud Elements ${ceEnv}.`);
  
  const instances = await getAllInstances();

  instances.forEach(i => {
    console.log(`INFO: Formula template ID ${i.templateId} found ${i.results.length} instance(s).`);
  });

  if (mode === "DELETE") {
    const toDelete = instances.filter(i => i.results.length > 0);
    const deleted = await deleteAllInstances(toDelete);

    deleted.forEach(d => {
      console.log(`INFO: Formula template ID ${d.templateId} successfully deleted ${d.results.length} instance(s).`);
    });
  }
};

start();

