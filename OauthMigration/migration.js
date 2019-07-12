// If you have run the NeedsMigrating script you will have gotten an array of element tokens returned you can use that array
// to set elementTokens to or you can get element tokens for some elements you want to individual migrate and set
// element tokens equal to an array of those. But elementTokens must be an array even if you are only using one token to migrate
let elementTokens = ['']

// You will need to add the id and secret for the oauth application that you are migrating. You can't use any oauth2 creds
// This specifically has to be the oauth2 creds associated with the oauth1 app you originally authenticated against
// Quickbooks is now providing oauth2 creds for all oauth1 apps so that you can migrateToOauth2
// You will also need to add the callback url to the oauth2 section of the application
const client_id = ''
const client_secret = ''

//Insert Your User and Org tokens
const user = ''
const organization = ''
//Insert the base Url for the environment (either api or staging)
const baseUrl = ''

const https = require('https');
const request = require('request');
const postData = JSON.stringify({
  "client_id": `${client_id}`,
  "client_secret": `${client_secret}`
});

// will do a patch to https://api.cloud-elements.com/elements/api-v2/migrate-tokens to migrate tokens
function migrateTokens(elementtoken) {

  let element = elementtoken
  const options = {
    "host": `${baseUrl}.cloud-elements.com`,
    "path": "/elements/api-v2/migrate-tokens",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `User ${user}, Organization ${organization}, Element ${element}`,
      "Elements-Session": "true",
    },
    method: 'PUT'
  };


  const req = https.request(options, (res) => {

    res.on('data', function(chunk) {
      console.dir('BODY: ' + chunk, { maxArrayLength: null });
    });
  });

  req.on('error', (e) => {
    console.log('problem with request: ' + e.message, {maxArrayLength: null});
  });
  req.write(postData);
  req.end()
}

//Loop through elementtokens to send in headers and migrate for each token
for (var i = 0; i < elementTokens.length; i++) {
  var elementtoken = elementTokens[i];
  migrateTokens(elementtoken)
}
