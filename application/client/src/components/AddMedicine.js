import React, { Component } from 'react'; 
import { graphql } from 'react-apollo';

// queries
import { getDayOfWeeksQuery, addMedicineMutation } from '../queries/queries'; 

var compose = require('lodash.flowright'); 

class AddMedicine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            count: 0,
            times: {},
            dayNames: {}
        };
    }

    handleInputChange (e) {
        // console.log(e.target.name); 
        // console.log(e.target.name in (this.state)); 
        // if (e.target.name in (this.state.dayNames)) {
        //     delete (this.state.dayNames)[e.target.name];
        // } else {
        //     (this.state.dayNames)[e.target.name] = true; 
        // }
        // console.log(this.state.dayNames); 
        console.log(this); 
    }

    submitForm(e) {
        e.preventDefault(); 
        this.props.addMedicineMutation({
            variables: {
                name: this.state.name,
                count: this.state.count,
                times: Object.keys(this.state.times),
                dayNames: Object.key(this.state.dayNames)
            },
            refetchQueries: [{query: getDayOfWeeksQuery }]
        });
    }

    displayDays() {
        let data = this.props.getDayOfWeeksQuery; 
        if (data.loading) {
            return (<option disabled>Loading Days...</option>);
        } else {
            return data.dayOfWeeks.map((day) => {
                let dayName = day._id; 
                return (
                    <div key={dayName}>
                        <label>
                            {dayName}
                            <input 
                                name={dayName}
                                type="checkbox"
                                onChange={this.handleInputChange}/>
                        </label>
                    </div>
                );
            });
        }
    } 

  	render () {    
        console.log(this);    
    	return (
            <form id="add-medicine" onSubmit={ this.submitForm.bind(this) }>
                {this.displayDays()}
            </form>
    	);
  	}
}

export default compose (
    graphql(getDayOfWeeksQuery, { name: "getDayOfWeeksQuery" }),
    graphql(addMedicineMutation, { name: "addMedicineMutation" })
)(AddMedicine); 