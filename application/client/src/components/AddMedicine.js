import React, { Component } from 'react'; 
import { graphql } from 'react-apollo';
import { Button, Form } from 'react-bootstrap'; 

// queries
import { 
    getDayOfWeeksQuery, 
    addMedicineMutation, 
    getMedicinesQuery 
} from '../queries/queries'; 

var compose = require('lodash/flowRight');


const OwnCheckbox = (props) => {
    
    if (props.disabled) {
        return (

            <div key="default-checkbox" className="mb-3">
                <Form.Check
                    type="checkbox"
                    id="default-checkbox"
                    label="disabled"
                    disabled={true}
                />
            </div>
        );
    } else {
        return (

            <div key={ props.name } className="mb-3">
                <Form.Check
                    type="checkbox"
                    id={ props.name }
                    label={ props.name }
                    onChange={ props.onChange }
                    checked={ props.checked }
                />
            </div>
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
            dose: '',
            nameValid: false,
            daysValid: false,
            timesValid: false,
            countValid: false,
            doseValid: false
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
                    <OwnCheckbox name="Loading..." disabled={ true } />
                </li>
            );
        } else {
            return (
                this.props.getDayOfWeeksQuery.dayOfWeeks.map((dayObj) => {
                    const dayName = dayObj._id; 
                    return (
                        <div key={dayName}>
                            <OwnCheckbox 
                                name={dayName}
                                disabled={false}
                                onChange={ () => this.handleDaysInput(dayName) }
                                checked={ this.state.days.has(dayName) }
                            />
                        </div>
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
            !this.state.timesValid ||
            !this.state.doseValid
        ) {
            disabled = true;
            marking = (<span>incomplete</span>)
        }

        // return (<button  disabled={disabled}>{marking}</button>)
        return (
            <Button 
                variant="primary" 
                disabled={disabled}
                type="submit"
            > 
                {marking}
            </Button>); 

        
    }

    handleDoseInput = (e) => {
        this.setState({
            dose: e.target.value
        });
        this.checkDoseValid(e.target.value);
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
        if (name === '') {
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

    checkDoseValid = (dose) => {
        if (
            Number.isNaN(Number.parseInt(dose)) ||
            Number.parseInt(dose) <= 0
        ) {
            this.setState({ doseValid: false });
        } else {
            this.setState({ doseValid: true });
        }
    }

    returnFieldDescription = (field) => {

        return this.state[field]?
        (<Form.Text className="text-muted, valid">Accepted field</Form.Text>):
        (<Form.Text className="text-muted, invalid">Invalid field</Form.Text>);

    }

    submitForm = (e) => {
        e.preventDefault();
        this.props.addMedicineMutation({
            variables: {
                name: this.state.name,
                count: Number.parseInt(this.state.count),
                dose: Number.parseInt(this.state.dose),
                times: [...(new Set(this.state.times.split(',').map(term => Number.parseInt(term.trim()))))],
                dayNames: Array.from(this.state.days.keys())
            },
            refetchQueries: [
                { query: getDayOfWeeksQuery },
                { query: getMedicinesQuery }
            ]
        });

        this.setState({
            name: '',
            days: new Map(),
            times: '',
            count: '',
            dose: '',
            nameValid: false,
            daysValid: false,
            timesValid: false,
            countValid: false,
            doseValid: false
        });
    }


  	render () { 
    
    	return (
                <form className="medForm" id="add-medicine" onSubmit={ (e) => this.submitForm(e) }>
                    
                    <div className="field-name">
                        <Form.Group controlId="name-Input">
                            <Form.Label>Medicine name</Form.Label>
                            <Form.Control
                                style={{ width: "30rem" }}
                                type="text"
                                placeholder="Enter medicine name"
                                value={this.state.name}
                                onChange={(e) => this.handleNameInput(e)} 
                            />
                            
                            {this.returnFieldDescription('nameValid')}
                            
                        </Form.Group>
                    </div>

                    <div className="field">
                        <label>Days: {this.returnFieldDescription('daysValid')}</label>
                        
                        {this.displayDays()}
                        
                    </div>

                    <div className="field-dose">
                        
                        <Form.Group controlId="dose-Input">
                            <Form.Label>Dose (Number)</Form.Label>
                            <Form.Control 
                                style={{ width: "30rem" }}
                                type="text"
                                placeholder="Enter Dose Count"
                                value={this.state.dose}
                                onChange={(e) => this.handleDoseInput(e)} 
                            />
                            
                            {this.returnFieldDescription('doseValid')}
                            
                        </Form.Group>

                    </div>
                    <div className="field-times">
                        <Form.Group controlId="times-Input">
                            <Form.Label>Times (e.g. 10, 15 means 10:00, 15:00)</Form.Label>
                            <Form.Control 
                                style={{ width: "30rem" }}
                                type="text"
                                placeholder="Enter Times"
                                value={this.state.times}
                                onChange={(e) => this.handleTimesInput(e)} 
                            />
                            
                            {this.returnFieldDescription('timesValid')}
                            
                        </Form.Group>
                        
                    </div>

                    <div className="field-count">

                        <Form.Group controlId="count-Input">
                            <Form.Label>Count (Number)</Form.Label>
                            <Form.Control 
                                style={{ width: "30rem" }}
                                type="text"
                                placeholder="Enter medicine count"
                                value={this.state.count}
                                onChange={(e) => this.handleCountInput(e)} 
                            />
                            {this.returnFieldDescription('countValid')}
                        </Form.Group>
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