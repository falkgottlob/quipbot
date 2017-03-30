Quipbot with integration to Salesforce


Follow the instructions below to create your own instance of the bot:

### Step 1: Create a Connected App

If you haven't already done so, follow the steps below to create a Salesforce connected app:

1. In Salesforce Setup, type **Apps** in the quick find box, and click the **Apps** link

1. In the **Connected Apps** section, click **New**, and define the Connected App as follows:

    - Connected App Name: MyConnectedApp (or any name you want)
    - API Name: MyConnectedApp
    - Contact Email: enter your email address
    - Enabled OAuth Settings: Checked
    - Callback URL: http://localhost:8200/oauthcallback.html (You'll change this later)
    - Selected OAuth Scopes: Full Access (full)
    - Click **Save**

### Step 2: Deploy the Quipbot

This Quipbot opens a websocket to quip, and can retrieve and update Salesforce data.


##Usage

###query:
\#sobject limit fields

examples:

\#case 10

*gets 10 cases*

\#contact 50 id,firstname,lastname

*gets 50 contacts with id, firstname and lastname*

###update:
\#upload sobject

examples

\#upload case

*updates all retrieved cases* 

if you want to update records always load the id as the first field!

##Steps to setup:

Create a new quip org, the trial is free! If you already have an org for your company, go create a personal one anyway!

When you're logged in, go to this link: <a href="https://quip.com/api/personal-token" target="new">Personal API Token</a>
Copy the API Token, then click below on the deploy button:

But first, make sure you're not using your production org where you, and all your co-workers store highly confidential information.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Pick a name for your app, and be sure to use the same url in the WHERE environment variable.

Just put xxx in the SFDC_ environment variables for now.

Go to your (dev or demo environment) Salesforce, create a new connected app for oauth.

For the callback url use: https://yourquipbot.herokuapp.com/oauth2/callback

Copy / past the consumer keys into the setting of the heroku app.

Restart the dyno.


