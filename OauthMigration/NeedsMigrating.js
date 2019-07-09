//Insert Your User and Org tokens
const user = 'H/yCmhFWqgJYTZwvsUiCUgfGPeCy8yocrVFyHsCVCSE='
const organization = '9972019b3d4820b2b183bafb60d01704'
//Insert the base Url for the environment
const baseUrl = 'staging'

var request = require('request');
let keepGoing = true;
let page = 1;
instances = []
let newResp = []
let count = 0;

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var resp = JSON.parse(response.body)
    instances = instances.concat(resp)
    if (response.headers['elements-total-count'] > 200) {
      var totalPages = (Math.floor(response.headers['elements-total-count'] / 200)) + 1
      page++;

      if (totalPages < page) {
        keepGoing = false;
      }
      nextPage = response.headers['elements-next-page-token'];
      getInstance(nextPage);
    } else {
      keepGoing = false;
      getInstance();
    }
  } else {
    return {
      "error": "request failed" + " " + error
    }
  }
}

function getInstance(nextPage) {
  var options = {
    "headers": {
      "Accept": "application/json",
      "Authorization": `User ${user}, Organization ${organization}`,
      "Elements-Session": "true",
    },
    method: 'GET'
  };
  if (nextPage) {
    options.uri = `https://${baseUrl}.cloud-elements.com/elements/api-v2/instances?hydrate=false&nextPage=${nextPage}`;
  } else {
    options.uri = `https://${baseUrl}.cloud-elements.com/elements/api-v2/instances?hydrate=false`
  }
  if (keepGoing === true) {
    request(options, callback);
  } else {
    sortInstances(instances)
  }

}
getInstance();


function sortInstances(instances) {
  const results = instances.filter(instances => instances.element.key === 'quickbooks' && instances.element.authentication.type === 'oauth1');

  results2 = results.map(results => results.token);
  results3 = results.map(results => results.id)
  for (var i = 0; i < results3.length; i++) {
    const instanceId = results3[i];
    var options = {
      uri: `https://${baseUrl}.cloud-elements.com/elements/api-v2/instances/${instanceId}`,
      "headers": {
        "Accept": "application/json",
        "Authorization": `User ${user}, Organization ${organization}`,
        "Elements-Session": "true",
      },
      method: 'GET'
    };
    request(options, callback2)
  }

  return ({
    "elementTokens": results2,
    "instanceIds": results3
  })
}

function callback2(error, response, body) {
  if (!error && response.statusCode == 200) {
    var resp = JSON.parse(response.body)
    if (resp.configuration && resp.configuration['authentication.type'] === 'oauth1') {
      newResp.push(resp)
    }
    let newResp2 = newResp.map(newResp => newResp.token);
    let newResp3 = newResp.map(newResp => newResp.id)
    count++;
    if (count < results3.length) {
      newResp2 = newResp.map(newResp => newResp.token);
      newResp3 = newResp.map(newResp => newResp.id);
    } else {
      console.dir(
        {
          "elementTokens": newResp2,
          "instanceIds": newResp3
        },
        {
          maxArrayLength: null
        }
      )
    }

    return newResp
  } else {
    return {
      "error": "request failed" + " " + error
    }
  }
}
