/*
  CAUTION: Running this script will delete formula instances as defined in readme.md, this action is permanent.
*/

require('dotenv').config()
const axios = require('axios');

const headers = () => {
  return {
    'Authorization': `User ${process.env.USER_SECRET}, Organization ${process.env.ORG_SECRET}`,
    'content-type': 'application/json'
  };
}

const baseUrl = () => {
  switch (process.env.CE_ENV) {
    case "STAGING":
      return "staging.cloud-elements.com";
    case "PROD":
      return "api.cloud-elements.com";
    case "PROD_EU":
      return "api.cloud-elements.co.uk";
  }
}

const getInstances = async (token) => {
  let url = `https://${baseUrl()}/elements/api-v2/formulas/${process.env.FORMULA_TEMPLATE_ID}/instances`;
  if (token) {
    url = `${url}&nextPage=${token}`;
  }

  try {
    const res = await axios.get(url, { headers: headers() });
    return res;
  } catch (e) {
    console.error(e);
  }
};

const getAllInstances = async () => {
  let results = [];
  let keepGoing = true;
  let nextPageToken;

  while (keepGoing) {
    let res = await getInstances(nextPageToken);

    if (res && res.status === 200) { await results.push.apply(results, res.data); }

    if (res && res.status === 200 && res.headers["elements-next-page-token"]) {
      nextPageToken = res.headers["elements-next-page-token"]
    } else {
      keepGoing = false;
    }
  }

  return results;
}

const deleteInstances = (instances) => instances.map(i => deleteInstance(i.id));

const deleteInstance = async (instanceId) => {
  try {
    await axios.delete(`https://${baseUrl()}/elements/api-v2/formulas/${process.env.FORMULA_TEMPLATE_ID}/instances/${instanceId}`, {
      headers: headers()
    });
  } catch (e) {
    console.error(`Error: ${e.response.data.message}, requestId: ${e.response.data.requestId}`);
  }
}

const start = async () => {
  const mode = process.env.MODE;
  console.log(`INFO: running script in ${mode} mode.`);
  
  const instances = await getAllInstances();
  console.log(`INFO: found ${instances.length} instance(s) to delete.`);

  if (mode === "DELETE") {
    const deleted = await deleteInstances(instances);
    console.log(`INFO: successfully deleted ${deleted.length} instance(s).`);
  }
};

start();

