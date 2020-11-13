# Delete All Formula Instances for a Given Template or Templates

## Use Case
As a user, I would like to delete all formula instances for a given formula template or a list of templates.

## Warning
Running this script in `DELETE` mode is destructive and irreversible.

## Setup

### Node
Use node version as defined in `.nvmrc`.  If you currently use nvm to manage node versions, cd into the project directory and run `nvm use`.

### Dotenv
Requires a `.env` file in project root, copy the contents of `.env-example` and paste them into your `.env` file.  Fill out each of the fields before running the script.  
| Key | Value Datatype | Description | Example |
|-----|-----|------|-----|
| ORG_SECRET | String | Your organization secret for the CE environment used below | abdc1234 |
| USER_SECRET | String | Your user secret for the CE environment used below | abdc1234 |
| CE_ENV | String | One of STAGING, PROD, EU_PROD | STAGING |
| FORMULA_TEMPLATE_IDS | String | Comma delimited list of formula template IDs | 32970,22183,40815,34203 |
| MODE | String | Run the script in GET or DELETE mode | GET |

#### Modes
There are two modes when running the delete script, GET or DELETE (as defined in the `.env` file).
- GET will log the number of formula instances found for the template IDs
- DELETE will delete all instances for the template IDs (to delete instances for multiple templates, supply a comma delimited list in the `.env` file)

## Running the Script
Once your `.env` file is setup, cd into the project directory and type `npm start` or `node index.js` in the terminal.