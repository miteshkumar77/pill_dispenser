import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, Card, ListGroup, Form } from 'react-bootstrap'; 


import {
    getDayOfWeeksQuery,
    getMedicinesQuery,
    deleteMedicineMutation,
} from '../queries/queries';

var compose = require('lodash/flowRight'); 

const MedicineWidget = (props) => {
    if (props.disabled) {
        return (
            <ListGroup.Item>
                {props.value}
            </ListGroup.Item>
        );
    } else {
        return (

            <ListGroup.Item key={props.value.name}>
                <ListGroup horizontal>
                    <ListGroup.Item className="text-center" variant="info">
                        <Form.Text>
                            {props.value.name}
                        </Form.Text>
                    </ListGroup.Item>
                    <ListGroup.Item key="day-widget">
                    {props.value.days.map(day => {
                        return (
                        
                            <Form.Text key={day._id}>
                                {day._id + '\n'}
                            </Form.Text>
                        
                        );
                    })}
                    </ListGroup.Item>

                    <ListGroup.Item variant="info">
                        <Form.Text>

                            Dose: {props.value.dose}
                        </Form.Text>
                    </ListGroup.Item>
                    <ListGroup.Item variant="danger">
                        <Button
                            variant="danger"
                            disabled={false}
                            onClick={props.onChange}
                        >
                            Delete    
                        </Button> 
                    </ListGroup.Item>
                </ListGroup>
                
            </ListGroup.Item>
        );
    }
    
}

class ManageMedicine extends Component {


    handleOnChange = (medicine) => {
        this.props.deleteMedicineMutation({
            variables: {
                id: medicine.id
            },
            refetchQueries: [
                { query: getDayOfWeeksQuery },
                { query: getMedicinesQuery }
            ]
        })
    }

    displayMedicineWidgets = () => {
        
        if (this.props.getMedicinesQuery.loading) {
            return (
                <MedicineWidget value="Loading medications..." disabled={true} />
            );
        } else if (this.props.getMedicinesQuery.medicines.length === 0) {
            return (
                <MedicineWidget
                    value="Added medications will show here"
                    disabled={true}
                />
            );
        } else {
            console.log(this.props.getMedicinesQuery); 
            return (
                this.props.getMedicinesQuery.medicines.map(medicine => {
                    return (
                        <MedicineWidget
                            key={medicine.id}
                            value={medicine}
                            onChange={(e) => this.handleOnChange(medicine)}
                        />
                    );
                })
            );
        }
    }

    render() {
        return (
            <div id="ManageMedicine">
                 
                <Card style={{ width: "30rem" }}>
                    <Card.Header>Manage Medications</Card.Header>
                    <ListGroup variant="flush">
                        { this.displayMedicineWidgets() }
                    </ListGroup>
                </Card>

            </div>
        );
    }
}

export default compose (
    graphql(getMedicinesQuery, { name: "getMedicinesQuery" }),
    graphql(deleteMedicineMutation, { name: "deleteMedicineMutation" }),
)(ManageMedicine);

