# Migrate a Resource from an Extended Element into Sub Account(s)

## Use Case
Given an element that is extendable (using Element Builder), I would like to take an extension (a resource that is added/modified) from my default account, and update elements in each of my sub accounts accordingly.

Note, if you extend an element in a given account, [at present] that extension will not be available in other accounts.

## Warning
Running this script in CREATE or DELETE mode will create account admin users in each of your sub accounts.  The last step of the script will remove those users.

## Setup

### Node
For the best results, use the node version defined in `.nvmrc`.  If you currently use nvm to manage node versions, cd into the project directory and run `nvm use`.

### Dotenv
Requires a `.env` file in project root, copy the contents of `exampleEnv.txt` and paste them into your `.env` file.  Fill out each of the fields before running the script.  Please note, the org/user secret provided in the `.env` file should be the credentials of an organization admininstrator.  The script will log an error and exit if any of the required values in `.env` are null or undefined.

### Required Permissons for Org Admin and Account Admin Roles
*Org Admin*
- Add Account Users
- Delete Account Users

*Account Admin*
- Edit Elements

#### Modes
There are three modes when running this script, _GET_, _CREATE_ and _DELETE_ (as defined in the .env file).
- GET will log the number of sub accounts the script found, no other actions will be taken.
- CREATE will create a temporary account admin for each sub-account, then for each account, add the resource supplied in `payload.json` to the element (key) defined in `.env`.
- DELETE will create a temporary account admin for each sub-account, then for each account, delete the resourse (based on the path and method) supplied in `payload.json` in the element (key) defined in `.env`.  Note: this will _not_ modify or delete the resources included in the generally available element (if there is one), even if the path and method match--only extended resources will be deleted.

#### The Resource
The resource you would like to add to a given element in your sub-accounts should be stored in `resource.json` (in the project root).  Note, the payload included in `resource.json` is an example, replace the contents of the file with your resource.

#### How to I get the resource for payload.json?
This is the resource you would like to include for a given element in your sub accounts, no need to remove any fields from the payload.
GET `/elements/{keyOrId}/resources` => find the resource ID in the response
GET `/elements/{keyOrId}/resources/{resourceId}` => save this response in `payload.json`

## Running the Script
Once your `.env` file is setup, cd into the project directory and type `npm start` or `node index.js` in the terminal.

## FAQ
_Is upsert supported?_
Technically no, but it can be accomplished by running _DELETE_ then _CREATE_.