# Migrate OAuth1 Instances--QBO

## **IMPORTANT NOTE:**
This script was used when QBO migrated from oauth1 to oauth2 and is not applicable to other use-cases. Use this script as an example for how to interact with Cloud Elements APIs using a script.

## Usage
This script will help you migrate all QBO oauth1 instances to oauth2.

The first script [NeedsMigrating.js](NeedsMigrating.js) will get all instances, paging through to make sure it has all of them. Then
filter it by elementkey (quickbooks) and authtype (oauth1). Then the second script [migration.js](migration.js) will migrate all of the instances you wish to migrate.

## Usage
1. Add your unique variables at the top of the js file
2. `cd` into oauthMigration folder and run the `npm install` command. 
3. Run `node NeedsMigrating.js` to get two arrays:
    * Array 1 will log all of the element keys of elements that need migrating.
    * Array 2 will log all of the instances of the elements that need migrating.
4. Inside the `migration.js` file, fill in elementTokens with an array of the elements you want to migrate (this can be all of the element tokens from step 3 or any subset of them).
5. Fill in all user data (user and org secrets) as well as client_id and client_secret that you get from your quickbooks oauth2 app (this has to be the same app the oauth1 instances were associated with).
6. Run `node migration.js` to loop through the element tokens and migrate each of them.
7. You will get a log of the results (in the same order of the array) incase it fails for any of them fail.
