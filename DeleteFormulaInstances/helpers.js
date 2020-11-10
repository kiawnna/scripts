const headers = (user, org) => {
  return {
    'Authorization': `User ${user}, Organization ${org}`,
    'content-type': 'application/json'
  };
};

const baseUrl = (ceEnv) => {
  switch (ceEnv) {
    case "STAGING":
      return "staging.cloud-elements.com";
    case "PROD":
      return "api.cloud-elements.com";
    case "PROD_EU":
      return "api.cloud-elements.co.uk";
  }
};

const parseTemplateIds = (strFromEnv) => strFromEnv.split(',').map(s => s.trim());

const getEnv = () => {
  const e = process.env;

  return {
    mode: e.MODE.toUpperCase(),
    templateIds: parseTemplateIds(e.FORMULA_TEMPLATE_IDS),
    ceEnv: e.CE_ENV.toUpperCase(),
    userSecret: e.USER_SECRET,
    orgSecret: e.ORG_SECRET,
  };
};

module.exports = { headers, baseUrl, getEnv };