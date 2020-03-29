const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const webpush = require('web-push');
const {
    hourlyEligibleNotifications,
    sendNotification,
    configureNotification,
    executeFuncEveryMinute,
    executeFuncEveryHour
} = require('./isHourlyNotificationEligible'); 
let user_sub; 

const publicVapidKey = 'BDvQD1LxhycVHPPbmBD3BE2L7b7LE3VE9XO-o6NmCjs1D1XqKb6vCczdE671TvQlkLe2eupqXSbxO1bksiajfEE';
const privateVapidKey = 'no9V0V8YHXi5Z4khAJOTBBCGTG9LGL_CbEY0qOZ4Zvg';

webpush.setVapidDetails('mailto:miteshkumarca@gmail.com', publicVapidKey, privateVapidKey);

function saveSubscriptionToDatabase(subscription) {
    user_sub = subscription; 
}



const server = async() => {
// cluster uri
const uri = 'mongodb+srv://miteshDB:hMsibDp5BPwRAgQ0@gqlmitesh-ic1rs.mongodb.net/test?retryWrites=true&w=majority';

    const app = express(); 

    // allow cross-origin requests
    app.use(cors()); 
    app.use(require('body-parser').json());
    app.post('/subscribe', (req, res) => {
        const isValidSaveRequest = (req, res) => {
            if (!req.body || !req.body.endpoint) {
                res.status(400); 
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    error: {
                        id: 'no-endpoint',
                        message: 'Subscription must have an endpoint.'
                    }
                }));
                return false; 
            }
            return true; 
        }; 
        
        return saveSubscriptionToDatabase(req.body)
        .then(function(subscriptionID) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ data: { success: true }}));
        })
        .catch(function(err) {
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                error: {
                    id: 'unable-to-save-subscription',
                    message: 'The subscription was received but we were unable to save it to our database.'
                }
            }));
        });
    });

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
    
    executeFuncEveryMinute(() => {
        hourlyEligibleNotifications()
        .then((result) => configureNotification(result))
        .catch((error) => console.log(error));
    }); 

    // hourlyEligibleNotifications()
    //     .then((result) => configureNotification(result))
    //     .catch((error) => console.log(error));

}

server(); 




