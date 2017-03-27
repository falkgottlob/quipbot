"use strict";

let jsforce = require('jsforce'),

    SF_CLIENT_ID = process.env.SFDC_CONSUMER,
    SF_CLIENT_SECRET = process.env.SFDC_SECRET,
    SF_USER_NAME = "falk@falkquip.demo",
    SF_PASSWORD = "X1266014",
    SF_WHERE = process.env.WHERE;

    
    //SF_USER_NAME = process.env.SF_USER_NAME,
    //SF_PASSWORD = process.env.SF_PASSWORD,



let org = new jsforce.Connection({
  oauth2 : {
    // you can change loginUrl to connect to sandbox or prerelease env.
    // loginUrl : 'https://test.salesforce.com',
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    redirectUri : process.env.WHERE + '/oauth2/callback',
  }
});





let login = () => {
    org.login(SF_USER_NAME, SF_PASSWORD, function(err, userInfo) {
      if (err) { return console.error(err); }
        // Now you can get the access token and instance URL information.
        // Save them to establish connection next time.
        console.log(org.accessToken);
        console.log(org.instanceUrl);
        // logged in user property
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);
       
       
      // ...
    });

};
  

  
  
   
        

let getCaseObject = (sobject) => {
      
    let where = "",
        fields = "",
        limit = "";

    switch (sobject) {
    case 'case':
        fields ='Id, Subject, description, Status';
        limit = "10";
        break;
    case 'workorder':
        fields ='id, Subject, Status';
        limit = "10";
        break;
    case 'contact':
        fields = "id, firstname, lastname, phone, email";
        limit = "10";
        break;
    default:
        fields ='Id, Name';
        limit = "10";
    }

    return getObject(sobject, fields, limit);

};


let getObject = (sobject, fields, limit) => {
      return new Promise((resolve, reject) => {
        
        org.sobject(sobject)
          .find({}, fields )
          .limit(limit)
          .execute((err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else {
                for (var i = 0, len = resp.length; i < len; i++) {
                    delete resp[i].attributes;
                }
                resolve(resp);
            }

        });
    });

};

let findProperties = (params) => {
    let where = "";
    if (params) {
        let parts = [];
        if (params.id) parts.push(`id='${params.id}'`);
        if (params.city) parts.push(`city__c='${params.city}'`);
        if (params.bedrooms) parts.push(`beds__c=${params.bedrooms}`);
        if (params.priceMin) parts.push(`price__c>=${params.priceMin}`);
        if (params.priceMax) parts.push(`price__c<=${params.priceMax}`);
        if (parts.length>0) {
            where = "WHERE " + parts.join(' AND ');
        }
    }
    return new Promise((resolve, reject) => {
        let q = `SELECT id,
                    title__c,
                    address__c,
                    city__c,
                    state__c,
                    price__c,
                    beds__c,
                    baths__c,
                    picture__c
                FROM property__c
                ${where}
                LIMIT 5`;
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

let findPropertiesByCategory = (category) => {
    return new Promise((resolve, reject) => {
        let q = `SELECT id,
                    title__c,
                    address__c,
                    city__c,
                    state__c,
                    price__c,
                    beds__c,
                    baths__c,
                    picture__c
                FROM property__c
                WHERE tags__c LIKE '%${category}%'
                LIMIT 5`;
        console.log(q);
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.error(err);
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

let findPriceChanges = () => {
    return new Promise((resolve, reject) => {
        let q = `SELECT
                    OldValue,
                    NewValue,
                    CreatedDate,
                    Field,
                    Parent.Id,
                    Parent.title__c,
                    Parent.address__c,
                    Parent.city__c,
                    Parent.state__c,
                    Parent.price__c,
                    Parent.beds__c,
                    Parent.baths__c,
                    Parent.picture__c
                FROM property__history
                WHERE field = 'Price__c'
                ORDER BY CreatedDate DESC
                LIMIT 3`;
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });
};


let createCase = (propertyId, customerName, customerId) => {

    return new Promise((resolve, reject) => {
        let c = nforce.createSObject('Case');
        c.set('subject', `Contact ${customerName} (Facebook Customer)`);
        c.set('description', "Facebook id: " + customerId);
        c.set('origin', 'Facebook Bot');
        c.set('status', 'New');
        c.set('Property__c', propertyId);

        org.insert({sobject: c}, err => {
            if (err) {
                console.error(err);
                reject("An error occurred while creating a case");
            } else {
                resolve(c);
            }
        });
    });

};

login();

exports.getCaseObject = getCaseObject;
exports.getObject = getObject;
exports.org = org;
exports.findProperties = findProperties;
exports.findPropertiesByCategory = findPropertiesByCategory;
exports.findPriceChanges = findPriceChanges;
exports.createCase = createCase;