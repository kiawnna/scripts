# Migrate OAuth1 Instances
This script will help you migrate all QBO oauth1 instances to oauth2
First, it will get all instances, page through and make sure to have all of them. Then
filter it by elementkey (quickbooks) and authtype (oauth1). Then it will migrate all of the instances
that are found.

## Usage
1. add your unique variables at the top of the js file
2. cd into oauthMigration folder and npm install
3. then run `node NeedsMigrating.js` to get two arrays
    * Array 1 will log all of the element keys of elements that need migrating
    * Array 2 will log all of the instances of the elements that need migrating
4. Fill in elementTokens with an array of the elements you want to migrate (this can be all of the element tokens from step 3 or any subset of them)
5. Fill in all user data (user, org info) as well as client_id and client_secret that you get from your quickbooks oauth2 app (this has to be the same app the oauth1 instances were associated with)
6. Run `node migration.js` to loop through the element tokens and migrate each of them.
7. You will get a log of the results (in the same order of the array) incase it fails for any of them fail
