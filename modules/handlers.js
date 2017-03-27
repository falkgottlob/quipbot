"use strict";

let salesforce = require('./salesforce'),
    messenger = require('./messenger'),
    formatter = require('./formatter');

const pug = require('pug');
const compiledFunction = pug.compileFile('./views/index.pug');


exports.contact = (thread, values) => {
    messenger.addSection("Contact", thread);
    salesforce.getObject("contacts").then(records => {
        messenger.addSection(compiledFunction({  records: records, rtype: "sobject"}), thread);
    });
};

exports.searchHouse = (thread) => {
    messenger.addSection('OK, looking for houses for sale around you...', thread);
    salesforce.findProperties().then(properties => {
        messenger.addSection(formatter.formatProperties(properties), thread);
    });
};

exports.searchHouse_City = (thread, values) => {
    messenger.addSection('OK, looking for houses in ${values[1]}', thread);
    salesforce.findProperties({city: values[1]}).then(properties => {
        messenger.addSection(formatter.formatProperties(properties), thread);
    });
};

exports.searchHouse_Bedrooms_City_Range = (thread, values) => {
    messenger.addSection('OK, looking for ${values[1]} bedrooms in ${values[2]} between ${values[3]} and ${values[4]}', thread);
    salesforce.findProperties({bedrooms: values[1], city: values[2]}).then(properties => {
        messenger.addSection(formatter.formatProperties(properties), thread);
    });
};

exports.searchHouse_Bedrooms_City = (thread, values) => {
    messenger.addSection('OK, looking for ${values[1]} bedroom houses in ${values[2]}', thread);
    salesforce.findProperties({bedrooms: values[1], city: values[2]}).then(properties => {
        messenger.addSection(formatter.formatProperties(properties), thread);
    });
};

exports.searchHouse_Bedrooms = (thread, values) => {
    messenger.addSection('OK, looking for ${values[1]} bedrooms', thread);
    salesforce.findProperties({bedrooms: values[1]}).then(properties => {
        messenger.addSection(formatter.formatProperties(properties), thread);
    });
};

exports.searchHouse_Range = (thread, values) => {
    messenger.addSection('OK, looking for houses between ${values[1]} and ${values[2]}', thread);
    salesforce.findProperties({priceMin: values[1], priceMax: values[2]}).then(properties => {
        messenger.addSection(formatter.formatProperties(properties), thread);
    });
};

exports.priceChanges = (thread, values) => {
    messenger.addSection('OK, looking for recent price changes...', thread);
    salesforce.findPriceChanges().then(priceChanges => {
        messenger.addSection(formatter.formatPriceChanges(priceChanges), thread);
    });
};

exports.hi = (thread) => {

        //messenger.addSection({text: `Hello, ${response.first_name}!`}, thread);
   
};

exports.help = (thread) => {
    messenger.sendMessage('Ask a question', thread, "", null);
};