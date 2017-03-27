"use strict";

let nforce = require('nforce'),

    SF_CLIENT_ID = process.env.SFDC_CONSUMER,
    SF_CLIENT_SECRET = process.env.SFDC_SECRET,
    SF_USER_NAME = "falk@falkquip.demo",
    SF_PASSWORD = "X1266014",
    SF_WHERE = process.env.WHERE;

    
    //SF_USER_NAME = process.env.SF_USER_NAME,
    //SF_PASSWORD = process.env.SF_PASSWORD,

let org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    redirectUri : process.env.WHERE + '/oauth2/callback',
    mode: 'single',
    autoRefresh: true
});

let login = () => {
    org.authenticate({username: SF_USER_NAME, password: SF_PASSWORD}, err => {
        if (err) {
            console.error("Authentication error");
            console.error(err);
        } else {
            console.log("Salesforce: Authentication successful as " + SF_USER_NAME);
        }
    });
};

let getObject =  (records) => {
      return new Promise((resolve, reject) => {
        let sboject = records;
        let where = "";
        let fields = "id, firstname, lastname";
        let limit = "10";
        let q = `SELECT ${fields} 
                FROM ${sboject} 
                ${limit}`;




        org.sobject(sobject)
  .find({}, fields )
  .limit(limit)
  .execute(function(err, resp) {
            if (err) {
                reject("An error as occurred");
            } else {
               
                if(resp.records && resp.records.length) {
                    resp.records.forEach(function(rec) {
                      console.log('Lead: ' + rec.get('FirstName') + ' ' + rec.get('LastName'));
                    });
                  }
                
                resolve(resp.records);
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

exports.getObject = getObject;
exports.org = org;
exports.findProperties = findProperties;
exports.findPropertiesByCategory = findPropertiesByCategory;
exports.findPriceChanges = findPriceChanges;
exports.createCase = createCase;