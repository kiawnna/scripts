const headers = (userSecret = process.env.USER_SECRET) => {
  return {
    'Authorization': `User ${userSecret}, Organization ${process.env.ORG_SECRET}`,
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

const logError = (e) => {
  if (e.response && e.response.data && e.response.data.message && e.response.data.requestId) {
    console.error(`ERROR: ${e.response.data.message}, requestId: ${e.response.data.requestId}`);
  } else {
    console.error(e);
  }
}

module.exports = { headers, baseUrl, logError };