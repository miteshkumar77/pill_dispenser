import React, { Component } from 'react'; 
import ApolloClient from 'apollo-boost'; 
import { ApolloProvider } from 'react-apollo';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
// components

import DayOfWeeks from './components/DayOfWeeks';
import PopupForm from './components/PopupForm'; 
// import AddMedicine from './components/AddMedicine';
import ManageMedicine from './components/ManageMedicine';
import Notification from './components/Notification'; 


// const backEndUri = 'http://127.0.0.1:3001'

const backEndUri = 'https://cherry-crumble-00343.herokuapp.com';
// apollo client setup 
const client = new ApolloClient({
	uri: backEndUri + '/graphql'
});

const pubKey = 'BNbKwE3NUkGtPWeTDSu0w5yMtR86xz20BcsU_FUvSNlBS44xS0alcwGwIh9JYn9uwc98LoVO7kW08gMjKgFthh4';



class App extends Component {
  	render () {
    	return (
			<ApolloProvider client={client}>
				<div className="main">
					<h1 className="Header">Medication Reminders:</h1>
					
					<ListGroup className="Content" horizontal flush>
						<ListGroupItem>
							<div className="Component"><DayOfWeeks /> </div>
						</ListGroupItem>
						<ListGroupItem>
							<div className="Component"><ManageMedicine /></div>
							<div className="Component"><PopupForm /></div>
						</ListGroupItem>
					</ListGroup>
	
					<Notification pubKey={pubKey} uri={backEndUri} />
				</div>
			</ApolloProvider>
			
			
    	);
  	}
}

export default App;
