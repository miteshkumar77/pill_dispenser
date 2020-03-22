import React, { Component } from 'react'; 
import { graphql } from 'react-apollo';

// queries
import { getDayOfWeeksQuery, addMedicineMutation } from '../queries/queries'; 
import _ from 'lodash'; 

var compose = require('lodash/flowRight');


function Checkbox(props) {
    
    if (props.disabled) {
        return (
            <label>
                {props.name}
                <input type="checkbox" disabled={true}/>
            </label>
        );
    } else {
        return (
            <label>
                {props.name}
                <input 
                    type="checkbox" 
                    disabled={false} 
                    onClick={ props.onClick }
                />
            </label>
        );
    }
}


class AddMedicine extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            days: new Map(),
            times: new Map(),
            count: ''
        };
    }

    handleCheckClick = (name) => {
        const days = new Map(this.state.days);
        if (days.has(name)) {
            days.delete(name); 
        } else {
            days.set(name, true); 
        }

        this.setState({ days: days })
        console.log(this.state); 
    }


    displayDays = () => {
        let data = this.props.getDayOfWeeksQuery; 
        if (data.loading) {
            return (
                <li>
                    <Checkbox name="Loading..." disabled={ true } />
                </li>
            );
        } else {
            return (
                this.props.getDayOfWeeksQuery.dayOfWeeks.map((dayObj) => {
                    const dayName = dayObj._id; 
                    return (
                        <li key={dayName}>
                            <Checkbox 
                                name={dayName}
                                disabled={false}
                                onClick={() => this.handleCheckClick(dayName)}
                            />
                        </li>
                    );
                })
            );
        }
    }

  	render () { 
          
    	return (
            <form id="add-medicine">
                <div className="field">
                    <label>Medicine name:</label>
                    <input type="text"/>
                </div>

                <div className="field">
                    <label>Days:</label>
                    <ul>
                        {this.displayDays()}
                    </ul>
                </div>

                <div className="field">
                    <label>
                        Times:
                        <input type="checkbox"/> 
                    </label>
                       
                </div>

                <div className="field">
                    <label>Count:</label>
                    <input type="text"/>
                </div>
                <button>Submit</button>
            </form>
    	);
  	}
}

export default compose (
    graphql(getDayOfWeeksQuery, { name: "getDayOfWeeksQuery" }),
    graphql(addMedicineMutation, { name: "addMedicineMutation" })
)(AddMedicine); 