import React, { Component } from 'react'; 
import { graphql } from 'react-apollo';

// queries
import { getDayOfWeeksQuery, addMedicineMutation } from '../queries/queries'; 

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
                    onChange={ props.onChange }
                    checked={ props.checked }
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
            times: '',
            count: '',
            nameValid: false,
            daysValid: false,
            timesValid: false,
            countValid: false
        };
    }

    handleDaysInput = (name) => {
        const days = new Map(this.state.days);
        if (days.has(name)) {
            days.delete(name); 
        } else {
            days.set(name, true); 
        }

        this.setState({ days: days })
        this.checkDaysValid(days);
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
                                onChange={ () => this.handleDaysInput(dayName) }
                                checked={ this.state.days.has(dayName) }
                            />
                        </li>
                    );
                })
            );
        }
    }

    submitButton = () => {
        
        let disabled = false;
        let marking = (<span>&#x2713;</span>);
        
        if (
            !this.state.countValid ||
            !this.state.daysValid ||
            !this.state.nameValid ||
            !this.state.timesValid
        ) {
            disabled = true;
            marking = (<span>incomplete</span>)
        }

        return (<button disabled={disabled}>{marking}</button>)

        
    }

    handleNameInput = (e) => {
        this.setState({
            name: e.target.value 
        });
        this.checkNameValid(e.target.value); 
    }

    handleCountInput = (e) => {
        this.setState({
            count: e.target.value 
        });
        this.checkCountValid(e.target.value);
    }

    
    handleTimesInput = (e) => {
        this.setState({
            times: e.target.value
        });
        this.checkTimesValid(e.target.value);
    }

    checkNameValid = (name) => {
        if (name == '') {
            this.setState({ nameValid: false });
        } else {
            this.setState({ nameValid: true });
        }
    }

    checkDaysValid = (days) => {
        if (days.size === 0) {
            this.setState({ daysValid: false });
        } else {
            this.setState({ daysValid: true });
        }
         
    }

    checkTimesValid = (times) => {
        const valid = times.split(',').every((time) => {
           return !(Number.isNaN(Number.parseInt(time.trim())) ||
            Number.parseInt(time.trim()) > 24 ||
            Number.parseInt(time.trim()) < 0);
        });

        if (valid) {
            this.setState({ timesValid: true });
        } else {
            this.setState({ timesValid: false });
        }
    }

    checkCountValid = (count) => {
        if (
            Number.isNaN(Number.parseInt(count)) ||
            Number.parseInt(count) <= 0
        ) {
            this.setState({ countValid: false });
        } else {
            this.setState({ countValid: true });
        }
    }

    returnFieldDescription = (field) => {
        return this.state[field]?
        (<h5 id="accepted-mark">Accepted field</h5>):
        (<h5 id="invalid-mark">Invalid field</h5>);

    }

    submitForm = (e) => {
        e.preventDefault();
        this.props.addMedicineMutation({
            variables: {
                name: this.state.name,
                count: Number.parseInt(this.state.count),
                times: this.state.times.split(',').map(term => Number.parseInt(term.trim())),
                dayNames: Array.from(this.state.days.keys())
            },
            refetchQueries: [{ query: getDayOfWeeksQuery }]
        });

        this.setState({
            name: '',
            days: new Map(),
            times: '',
            count: '',
            nameValid: false,
            daysValid: false,
            timesValid: false,
            countValid: false
        });
    }


  	render () { 
         
         
        console.log(this.state); 

    	return (
            <form id="add-medicine" onSubmit={ (e) => this.submitForm(e) }>
                <div className="field">
                    <label>Medicine name: {this.returnFieldDescription('nameValid')} </label>
                    <input type="text" value={this.state.name} onChange={(e) => this.handleNameInput(e)}/>
                    
                </div>

                <div className="field">
                    <label>Days: {this.returnFieldDescription('daysValid')}</label>
                    <ul>
                        {this.displayDays()}
                    </ul>
                </div>

                <div className="field">
                    <label>
                        Times (Integers, comma separated):{this.returnFieldDescription('timesValid')}
                        <input type="text" value={ this.state.times } onChange={ (e) => this.handleTimesInput(e) }/>
                    </label>
                       
                </div>

                <div className="field">
                    <label>Count (Integer):{this.returnFieldDescription('countValid')}</label>
                    <input type="text" value={ this.state.count } onChange={ (e) => this.handleCountInput(e) }/>
                </div>
                {this.submitButton()}
            </form>
    	);
  	}
}

export default compose (
    graphql(getDayOfWeeksQuery, { name: "getDayOfWeeksQuery" }),
    graphql(addMedicineMutation, { name: "addMedicineMutation" })
)(AddMedicine); 