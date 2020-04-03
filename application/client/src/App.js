import React, { Component } from 'react'; 
import ApolloClient from 'apollo-boost'; 
import { ApolloProvider } from 'react-apollo';

// components

import DayOfWeeks from './components/DayOfWeeks';
import AddMedicine from './components/AddMedicine';
import ManageMedicine from './components/ManageMedicine';
import Notification from './components/Notification'; 


const backEndUri = 'http://127.0.0.1:3001'
// apollo client setup 
const client = new ApolloClient({
	uri: backEndUri + '/graphql'
});

const pubKey = 'BNbKwE3NUkGtPWeTDSu0w5yMtR86xz20BcsU_FUvSNlBS44xS0alcwGwIh9JYn9uwc98LoVO7kW08gMjKgFthh4';



class App extends Component {
  	render () {
    	return (
			<ApolloProvider client={client}>
				<div id="main">
					<h1>Medication Reminders:</h1>
                    <DayOfWeeks/>
					<ManageMedicine/>
					<AddMedicine/>
					<Notification pubKey={pubKey} uri={backEndUri} />
				</div>
			</ApolloProvider>
			
			
    	);
  	}
}

export default App;
