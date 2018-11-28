# CloudUX Service CRUD Example

Welcome to CloudUX Service CRUD Example! 

## Getting started
To use this application you will need following tools:
1. running **MediaCentral | Cloud UX 2018.6** machine
2. [node.js and npm](https://nodejs.org)

This service shows how to get asset information using Avid CTMS.

Before running the app you have to type authorization strings (index.js lines 4 and 21,
username and password (index.js, lines 11 and 12). 

At first we make a post call with our authorization parameters. If all of them are correct
we will receive access token as a result. 

Then using the access token we make a get call to all the dirs between us and asset.

Once we find an asset we log it's ID and then using it we make a call to the function 'get asset by id'.
As a result we should see a JSON file with asset's body.

You can set your host by overriding 'host' variable (index.js line 9).
