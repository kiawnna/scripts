# Delete All Formula Instances for a Given Template

## Use Case
As a user, I would like to delete all formula instances for a given formula template.

## Warning
Running this script in `DELETE` mode is destructive and irreversible.

## Setup

### Node
Use node version as defined in `.nvmrc`.  If you currently use nvm to manage node versions, cd into the project directory and run `nvm use`.

### Dotenv
Requires a `.env` file in project root, copy the contents of `.env-example` and paste them into your `.env` file.  Fill out each of the fields before running the script.

#### Modes
There are two modes when running the delete script, GET or DELETE (as defined in the .env file).
- GET will log the number of formula instances found for the template ID
- DELETE will delete all instances for the template ID

## Running the Script
Once your `.env` file is setup, cd into the project directory and type `npm start` or `node index.js` in the terminal.