const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 



const server = async() => {
// cluster uri
const uri = 'mongodb+srv://miteshDB:0005MKak01@gqlmitesh-ic1rs.mongodb.net/test?retryWrites=true&w=majority'

    const app = express(); 

    // allow cross-origin requests
    app.use(cors()); 

    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 
    mongoose.connection.once('open', () => {
        console.log('connected to database');
    });

    app.use('/graphql', graphqlHTTP({
        schema, 
        graphiql: true
    }));

    app.listen(3001, () => {
        console.log('now listening for requests on port 3001'); 
    }); 
}

server(); 




