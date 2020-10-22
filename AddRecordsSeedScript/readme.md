# Add Records Progromatically
The scripts contained in this directory (one for python and one for javascript) can be used to add records progromatically to a sandbox account for testing. The scripts are incredibly basic and meant to demonstrate a simple way to `POST` many records to an account/sandbox using Cloud Elements.

### Notes and Disclaimers:
1. The script uses Cloud Elements APIs, not the direct vendor API (although you could adjust to your use case if needed).
2. You will need to udpate various fields in this script to make it work for your use-case.
3. Please be aware of any API limits on the vendor side. You can adjust the time between posting records or post chunks of records on a daily schedule if needed.
4. **This is not intended for use on Production systems. This is for adding records to sandbox accounts for development, testing, and staging purposes.**

## Python script
This script uses the `requests` library to make the `POST` requests. It also uses the `faker`, `dotenv`, and `os` libraries to manage both the randomly generated and secrets stored in an `.env` file.

Included in this directory is a `requirements.txt` file. Run `pip install -r requirements.txt` to install the above dependencies. (It's suggested you do so inside a virutal environment. You can follow the directions [here](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/) to do so.).

### Customization Needed
You will need to update the following fields/values for your script to work.

1. In the `data` variable inside the `generatePayload` function, you need to make sure your field names and values match the Element you plan to use it for. The payload will currently generate randomized data with each request using the `faker` library. You can visit the link [here](https://faker.readthedocs.io/en/master/) for more information and options for you specific use-case. For example, if you need an zipcode field to be dynamically created, faker has a API method you can call using `faker.address.zipCode()`.

2. In the `Configs` section, update:
  * The `object` variable to match the Cloud Elements endpoint you plan to make `POST` requests to. **Note:** This is not the name of the endpoint on the vendor side, but the name of the endpoint in Cloud Elements. For example, if the vendor endpoint for posting a new contact is `Contact`, and Cloud Elements endpoint is `contacts`, please use the Cloud Elements endpoint (`contacts`) in your path.
  * The `maxRecords` variable to designate the amount of records you want to `POST`.

3. This script is intended for use with a `.env` file. While you can hard-code your secrets if you wish, creating a `.env` file with the following environment variables will automatically populate your secrets for you:
  > USER_SECRET = userSecretHere
  > ORGANIZATION_SECRET = organizationSecretHere
  > INSTANCE_TOKEN = instanceTokenHere

4. Currently in the `for loop`, upon a successful `POST` request, the status code, response body, and a message stating what number record out of the total (ie 4 out of 100 records) will be logged. You can update this to suite your needs/use-case as you see fit, as well as the error message returned when the status code is not a 200.

## Node.js script
This script uses the `axios` module from npm to make the `POST` requests as well as the `faker` and `dotenv` modules.

Included in this directory is a `package.json file`. Run `npm install` to install all the dependencies neccessary.

### Customization Needed
You will need to update the following in order for your script to run correctly.

1. In the `data` variable inside the `generatePayload` function, you need to make sure your field names and values match the Element you plan to use it for. The payload will currently generate randomized data with each request using the `faker.js` module. You can visit the link [here](https://www.npmjs.com/package/faker) for more information and options for you specific use-case. For example, if you need an zipcode field to be dynamically created, faker has a API method you can call using `faker.address.zipCode()`.

2. In the `configs` section, update:
  * The `object` variable to match the Cloud Elements endpoint you plan to make `POST` requests to. **Note:** This is not the name of the endpoint on the vendor side, but the name of the endpoint in Cloud Elements. For example, if the vendor endpoint for posting a new contact is `Contact`, and Cloud Elements endpoint is `contacts`, please use the Cloud Elements endpoint (`contacts`) in your path.
  * The `maxRecords` variable to designate the amount of records you want to `POST`.

3. This script is intended for use with a `.env` file. While you can hard-code your secrets if you wish, creating a `.env` file with the following environment variables will automatically populate your secrets for you:
  > USER_SECRET = userSecretHere
  > ORGANIZATION_SECRET = organizationSecretHere
  > INSTANCE_TOKEN = instanceTokenHere

4. Currently in the `loopRecords` function, upon a successful `POST` request, the status code, response body, and a message stating what number record out of the total (ie 4 out of 100 records) will be logged. You can update this to suite your needs/use-case as you see fit.



