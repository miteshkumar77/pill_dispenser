import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import {
    getDayOfWeeksQuery,
    getMedicinesQuery,
    deleteMedicineMutation,
} from '../queries/queries';

var compose = require('lodash/flowRight'); 

const MedicineWidget = (props) => {
    if (props.disabled) {
        return (
            <li key="disabled">disabled</li>
        )
    } else {
        return (
            <li>
                <label>
                    {props.value.name}:
                    Dose: {props.value.dose} -----
                    {props.value.days.map(day => day._id).join(', ')}
                    <button
                        disabled={false}
                        onClick={props.onChange}
                    >
                        Delete
                    </button>
                </label> 
            </li>
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
                <MedicineWidget disabled={true} />
            );
        } else {
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
                <h2>ManageMedicine</h2>
                <ul>
                    { this.displayMedicineWidgets() }
                </ul>
            </div>
        );
    }
}

export default compose (
    graphql(getMedicinesQuery, { name: "getMedicinesQuery" }),
    graphql(deleteMedicineMutation, { name: "deleteMedicineMutation" }),
)(ManageMedicine);

