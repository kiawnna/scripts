# Extend an Element in Sub Accounts

## Use Case
Given an element that is extendable (using Element Builder), I would like to take a resource from my default account, and update all elements in my sub accounts accordingly.

Note, if you extend an element in a given account, that extension will not be available in other accounts.

## Warning
Running this script in `CREATE` mode will create account admin users in each of your sub accounts.  The last step of the script will remove those users.

## Setup

### Node
Use node version as defined in `.nvmrc`.  If you currently use nvm to manage node versions, cd into the project directory and run `nvm use`.

### Dotenv
Requires a `.env` file in project root, copy the contents of `exampleEnv.txt` and paste them into your `.env` file.  Fill out each of the fields before running the script.  Please note, the org/user secret provided in the `.env` file should be the credentials of an organization admininstrator.

#### Modes
There are two modes when running the delete script, GET or DELETE (as defined in the .env file).
- GET will log the number of sub accounts the script found
- CREATE will create a temporary account admin for each account, then for each account, add the resource supplied in `payload.json` to the element (key) defined in `.env`.

#### The Resource
The resource you would like to add to a given element in your sub-accounts should be stored in `payload.json`.

#### How to I get the resource for payload.json?
GET `/elements/{keyOrId}/resources` => find the resource ID in the response
GET `/elements/{keyOrId}/resources/{resourceId}` => save this response in `payload.json`

## Running the Script
Once your `.env` file is setup, cd into the project directory and type `npm start` or `node index.js` in the terminal.