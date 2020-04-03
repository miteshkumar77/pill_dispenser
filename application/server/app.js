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
    executeFuncEveryMinute,
    executeFuncEveryHour
} = require('./isHourlyNotificationEligible'); 


let registrations = []; 
const publicVapidKey = 'BNbKwE3NUkGtPWeTDSu0w5yMtR86xz20BcsU_FUvSNlBS44xS0alcwGwIh9JYn9uwc98LoVO7kW08gMjKgFthh4';
const privateVapidKey = 'HICs69hPyBzMl_cTDUecB-rEWy0012R8EfvA9xygsRE';


const server = async() => {
// cluster uri
const uri = 'mongodb+srv://miteshDB:hMsibDp5BPwRAgQ0@gqlmitesh-ic1rs.mongodb.net/test?retryWrites=true&w=majority';

    
    const app = express(); 
    app.use(bodyParser.json()); 
    app.use(cors());
    

    // allow cross-origin requests
     
    
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
    
    

    
    webpush.setVapidDetails(
        'mailto:miteshkumarca@gmail.com',
        publicVapidKey,
        privateVapidKey
    ); 
    



    app.get('/vapidPublicKey', (req, res) => {
        res.send(publicVapidKey); 
    })

    app.post('/register', (req, res) => {
        // Get pushSubscription object
        registrations.push(req.body.subscription); 
        // Send 201 - resource created
        res.status(201).json({});
    })

    executeFuncEveryMinute(() => {
        hourlyEligibleNotifications()
        .then((result) => configureNotification(result))
        .then(() => {
            return Promise.all(registrations.map(registration => {
                return webpush.sendNotification(registration, JSON.stringify({title: "Medications Due, check app"})); 
            }));
        })
        .catch((error) => console.log(error));
    }); 
    // // Create payload
    // const payload = JSON.stringify({ title: 'Push Test' });

    // // Pass object into sendNotification
    // webpush.sendNotification(registrations[0], payload)
    // .catch(err => console.error(err)); 


}

server(); 




