# This script can be used to POST multiple records to an API in Cloud Elements by defining an `object` (ie /contacts, /invoices, /accounts, etc)
# from a Cloud Element's Element (ie Salesforce, QuickBooksOnline, etc), the number of records you want to POST, and the payload fields the Element expects.

# Notes:
# * The Authorization header is created with the intention of using a .env file to store your User and Organization secrets as well as the Element Instance Token.
# * The payload will be randomized with new data each time a record is posted, using the faker library.
# * The `object` variable is the object in Cloud Elements, not the object name from the vendor API.
# * The `maxRecords` variable is the number of records you want created.
# * A success message for each record containing the response body, status code, and the record number (ie record 4 of 100) will be returned with each POST. An error will cause the 
# script to stop before posting more records.

# * An example payload is supplied below for Salesforce, where you can see how faker is used to randomize the data. Visit https://faker.readthedocs.io/en/master/ for
# more examples pertinent to your use-case.

import requests
import time
from faker import Faker
import os
from dotenv import load_dotenv

faker = Faker()
load_dotenv()

# Configs
object = '/contacts'
maxRecords = 3

# Update the below `generatePayload` function with the correct payload for the API you want to `POST` to. This payload is for the Salesforce element.
def generatePayload():
    payload = {
        "FirstName": faker.first_name(),
        "LastName": faker.last_name(),
        "Email": faker.email()
    }
    return payload

# `POST` request starts here (nothing to update)
headers = {
    "Authorization": f'User {os.getenv("USER_SECRET")}, Organization {os.getenv("ORGANIZATION_SECRET")}, Element {os.getenv("INSTANCE_TOKEN")}',
    "Content-Type": "application/json",
    "accept": "application/json"
}

url = f'https://staging.cloud-elements.com/elements/api-v2/{object}'

try:
    for i in range(0, 3):
        payload = generatePayload()
        response = requests.post(url=url, json=payload, headers=headers)
        if response.status_code == 200:
            print(response.status_code)
            print((response.content).decode('utf-8'))
            print(f'Successfully posted {i+1} of {maxRecords} records!')
            time.sleep(1)
        else:
            print({
                "message": f'Request to post record {i+1} of {maxRecords} failed. Please see error_message below.',
                "error_message": (response.content).decode('utf-8'),
                "status_code": response.status_code
            })
            break

except Exception as e:
    print(e)