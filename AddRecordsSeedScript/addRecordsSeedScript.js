/*
This script can be used to POST multiple records to an API in Cloud Elements by defining an `object` (ie /contacts, /invoices, /accounts, etc)
from a Cloud Element's Element (ie Salesforce, QuickBooksOnline, etc), the number of records you want to POST, and the payload fields the Element expects.

Notes:
* The Authorization header is created with the intention of using a .env file to store your User and Organization secrets as well as the Element Instance Token.
* The payload will be randomized with new data each time a record is posted, using the faker.js module.
* The `object` variable is the object in Cloud Elements, not the object name from the vendor API.
* The `maxRecords` variable is the number of records you want created.
* A success message for each record containing the response body, status code, and the record number (ie record 4 of 100) will be returned with each POST. An error will cause the 
script to stop before posting more records.

* An example payload is supplied below for Salesforce, where you can see how faker.js is used to randomize the data. Visit https://www.npmjs.com/package/faker for
more examples pertinent to your use-case.
*/

require('dotenv').config();
const faker = require('faker');
const axios = require('axios').default;

// configs
const object = 'contacts';
const maxRecords = 3;

// Update the below `generatePayload` function with the correct payload for the API you want to `POST` to. This payload is for the Salesforce element.
function generatePayload() {
  let data = JSON.stringify({
    Email: faker.internet.email(),
    FirstName: faker.name.findName(),
    LastName: faker.name.findName()
  });
  return data;
}

// `POST` request starts here (nothing to update)
const options = {
    headers: {
      'Authorization': `User ${process.env.USER_SECRET}, Organization ${process.env.ORGANIZATION_SECRET}, Element ${process.env.INSTANCE_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };
  
async function doRequest() {
  let data = generatePayload();
  try {
      let response = await axios.post(`https://staging.cloud-elements.com/elements/api-v2/${object}`, data, options)
      return {
          payload: response.data,
          statusCode: response.status,
      }
  } catch (error) {
        throw new Error(error);
  }
}

const loopRecords = async () => {
  for( let i = 0; i < maxRecords; i++) {
    try {
      let r = await doRequest();
      console.log(r.statusCode);
      console.log(r.payload);
      console.log(`Successfully posted ${i+1} of ${maxRecords} records.`)
    } catch (error) {
      return error;
    }
  }
  return `Success! All ${maxRecords} records have been posted.`;
}

loopRecords().then(d => console.log(d)).catch(e => console.log(e));
