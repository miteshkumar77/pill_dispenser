import React, { Component } from 'react'; 
import ApolloClient from 'apollo-boost'; 
import { ApolloProvider } from 'react-apollo';

// components

import DayOfWeeks from './components/DayOfWeeks';
import AddMedicine from './components/AddMedicine';
// apollo client setup 
const client = new ApolloClient({
	uri: 'http://localhost:3001/graphql'
});

class App extends Component {
  	render () {
    	return (
			<ApolloProvider client={client}>
				<div id="main">
					<h1>Medication Reminders:</h1>
                    <DayOfWeeks/>
					<AddMedicine/>
				</div>
			</ApolloProvider>
    	);
  	}
}

export default App;
