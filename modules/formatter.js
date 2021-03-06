"use strict";

let moment = require("moment"),
    numeral = require("numeral"),
    salesforce = require('./salesforce'),
    messenger = require('./messenger');


 exports.formatObject = values => {
      
    let type = values,
        obj,
        where,
        conditions = [],
        fields,
        limit,
        sort = [];

    obj = type[0].toLowerCase();

    if (obj === 'case') {
        conditions.push({ LastName: { $like : "A%" } });
        fields = 'Id, Subject, description, Status';
        limit = 10;
        sort.push({ CreatedDate: -1, Name : 1 });
    } else if (obj  === 'workorder') {
        fields = 'id, Subject, Status';
        limit =  10;
    } else if (obj  === 'account') {
        if(values[1]) {
            conditions.push({ name: { $like :  type[1] + '%' } });
        }   
        fields = 'id, name, annualrevenue, yearstarted';
        limit =  10;
        sort.push({ CreatedDate: -1, name : 1 });
    } else if (obj  === 'contact') {
        if(values[1]) {
            conditions.push({ name: { $like :  type[1] + '%' } });
        }   
        fields = 'id, firstname, lastname, phone, email';
        limit =  10;
        sort.push({ CreatedDate: -1, lastname : 1 });
    } else {
        fields ='Id, Name';
        limit =  10;
    }


    return salesforce.getObject(obj, conditions, fields, limit, sort);

};  


exports.formatProperties = properties => {
    let elements = [];
 
    properties.forEach(property => {
            elements.push({
                title: property.get("Title__c"),
                subtitle: `${property.get("Address__c")}, ${property.get("City__c")} ${property.get("State__c")} · ${numeral(property.get("Price__c")).format('$0,0')}`,
                "image_url": property.get("Picture__c"),
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Schedule visit",
                        "payload": "schedule_visit," + property.getId()
                    },
                    {
                        "type": "postback",
                        "title": "View broker info",
                        "payload": "contact_broker," + property.getId()
                    },
                    {
                        "type": "postback",
                        "title": "Contact me",
                        "payload": "contact_me," + property.getId()
                    }
                ]
            })
        }
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};

exports.formatPriceChanges = priceChanges => {
    let elements = [];
    priceChanges.forEach(priceChange => {
            let property = priceChange.get("Parent");
            elements.push({
                title: `${property.Address__c}, ${property.City__c} ${property.State__c}`,
                subtitle: `Old price: ${numeral(priceChange.get("OldValue")).format('$0,0')} · New price: ${numeral(priceChange.get("NewValue")).format('$0,0')} on ${moment(priceChange.get("CreatedDate")).format("MMM Do")}`,
                "image_url": property.Picture__c,
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Schedule visit",
                        "payload": "schedule_visit," + property.Id
                    },
                    {
                        "type": "postback",
                        "title": "View broker info",
                        "payload": "contact_broker," + property.Id
                    },
                    {
                        "type": "postback",
                        "title": "Contact me",
                        "payload": "contact_me," + property.Id
                    }
                ]
            })
        }
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};


exports.formatAppointment = property => {
    var options = [
        moment().add(1, 'days').format('ddd MMM Do') + ' at 10am',
        moment().add(2, 'days').format('ddd MMM Do') + ' at 9am',
        moment().add(2, 'days').format('ddd MMM Do') + ' at 5pm',
        moment().add(3, 'days').format('ddd MMM Do') + ' at 1pm',
        moment().add(3, 'days').format('ddd MMM Do') + ' at 6pm',
    ];
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": `Select one of the available appointments below at ${property.get("Address__c")} in ${property.get("City__c")}.`,
                "buttons": [
                    {
                        "type": "postback",
                        "title": options[0],
                        "payload": "confirm_visit," + property.get("Address__c") + " in " + property.get("City__c") + "," + options[0]
                    },
                    {
                        "type": "postback",
                        "title": options[1],
                        "payload": "confirm_visit," + property.get("Address__c") + " in " + property.get("City__c") + "," + options[1]
                    },
                    {
                        "type": "postback",
                        "title": options[2],
                        "payload": "confirm_visit," + property.get("Address__c") + " in " + property.get("City__c") + "," + options[2]
                    }]
            }
        }
    };
};

exports.formatBroker = broker => {
    let elements = [];
    elements.push({
        title: "Caroline Kingsley",
        subtitle: "Senior Broker  · 617-219-6363 · ckingsley@dreamhouse.com",
        "image_url": "https://s3-us-west-1.amazonaws.com/sfdc-demo/messenger/caroline_500x260.png",
        "buttons": [
            {
                "type": "postback",
                "title": "Contact Me",
                "payload": "contact_me"
            }]
    });
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};