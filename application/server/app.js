const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const bodyParser = require('body-parser');
const path = require('path');
const webpush = require('web-push');
const {
    hourlyEligibleNotifications,
    configureNotification,
    // executeFuncEveryMinute,
    executeFuncEveryHour
} = require('./isHourlyNotificationEligible'); 



const server = async() => {
// cluster uri
const uri = 'mongodb+srv://miteshDB:hMsibDp5BPwRAgQ0@gqlmitesh-ic1rs.mongodb.net/test?retryWrites=true&w=majority';

    const app = express(); 


    // allow cross-origin requests
    app.use(cors()); 
    
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 
    mongoose.connection.once('open', () => {
        console.log('connected to database');
    });

    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    app.use('/graphql', graphqlHTTP({
        schema, 
        graphiql: true
    }));

    app.listen(3001, () => {
        console.log('now listening for requests on port 3001'); 
    });
    
    executeFuncEveryHour(() => {
        hourlyEligibleNotifications()
        .then((result) => configureNotification(result))
        .catch((error) => console.log(error));
    }); 


    console.log(__dirname + '/');
    app.use(express.static(path.join(__dirname + 'client')));
    app.use(bodyParser.json());


    const publicVapidKey = 'BNbKwE3NUkGtPWeTDSu0w5yMtR86xz20BcsU_FUvSNlBS44xS0alcwGwIh9JYn9uwc98LoVO7kW08gMjKgFthh4';
    const privateVapidKey = 'HICs69hPyBzMl_cTDUecB-rEWy0012R8EfvA9xygsRE';

    webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

    app.post('/subscribe', (req, res) => {
        // Get pushSubscription Object
        const subscription = req.body; 

        // Send 201 - resource created successfully 
        res.status(201).json({}); 

        // Create payload
        const payload = Json.stringify({ title: 'Push Test' });

        // Pass object into sendNotification
        webpush.sendNotification(subscription, payload).catch(err => console.error(err)); 
    });


}

server(); 




