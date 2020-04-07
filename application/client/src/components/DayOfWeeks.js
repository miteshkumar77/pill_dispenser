import React, { Component } from 'react'; 
import { graphql } from 'react-apollo';

// queries
import { getDayOfWeeksQuery } from '../queries/queries'; 
import { Card, CardGroup, Form, ListGroup } from 'react-bootstrap';


const DayOfWeekCard = (props) => {
    let list_med_info = () => {
        const medicines = props.value.medications; 
         if (medicines && medicines.length) {
            return (
                <ul id="meds-list">
                    {medicines.map((medicine) => {

                        let times = () => {
                            return medicine.times.map((time) => {
                                let c_time = time.toString().concat(":00"); 

                                return (
                                    <li key={c_time}>
                                        {c_time}
                                    </li>
                                ); 
                            });
                        }

                        return (
                            <li id="medicine" key={medicine.name}>
                                {medicine.name}
                                <ul id="info">
                                    <li id="count" key="Count">
                                        Count: {medicine.count}
                                    </li>
                                    <li id="times" key="times">
                                        Times:
                                        <ul>
                                            {times()}
                                        </ul>
                                    </li>
                                    <li id="dose" key="dose">
                                        Dose: {medicine.dose}
                                    </li>
                                </ul>
                            </li>
                        );
                    })}

                </ul>
            );
        } else {
            return (
                <Form.Text id="no-meds">No medicines for this day</Form.Text>
            );
        }
    }
    if (props.disabled) {
        return (
            <Card border="danger">
                <Card.Header>
                    {props.value}
                </Card.Header>
            </Card>
        );
    } else {

        const day_Array = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const today = day_Array[(new Date()).getDay()];
    
        return (
            
            <Card className="indiv-day" border={(today===props.value._id)?"success":false} style={{ width: '15rem' }}>
                <Card.Header>{props.value._id}</Card.Header>
                <Card.Body>
                    {   
                        list_med_info()
                    }
                </Card.Body>
            </Card>
        );        
        
    }
}

class DayOfWeeks extends Component {

    displayDayOfWeek(dayOfWeek) {
        let list_med_info = () => {
            let medicines = dayOfWeek.medications;
            if (medicines && medicines.length) {
                return (
                    <ul id="meds-list">
                        {medicines.map((medicine) => {

                            let times = () => {
                                return medicine.times.map((time) => {
                                    let c_time = time.toString().concat(":00"); 

                                    return (
                                        <li key={c_time}>
                                            {c_time}
                                        </li>
                                    ); 
                                });
                            }

                            return (
                                <li id="medicine" key={medicine.name}>
                                    {medicine.name}
                                    <ul id="info">
                                        <li id="count" key="Count">
                                            Count: {medicine.count}
                                        </li>
                                        <li id="times" key="times">
                                            Times:
                                            <ul>
                                                {times()}
                                            </ul>
                                        </li>
                                        <li id="dose" key="dose">
                                            Dose: {medicine.dose}
                                        </li>
                                    </ul>
                                </li>
                            );
                        })}

                    </ul>
                );
            } else {
                return (
                    <h3 id="no-meds">No medicines for this day</h3>
                );
            }
        }

        return (
            <div>
                <h2 id="day-name">
                    {dayOfWeek._id}
                </h2>
                <div id="med-info">
                    { list_med_info() }
                </div>
            </div>
        );
    }

    displayDayOfWeeks() {
        let data = this.props.data;

        if (data.loading) {
            return (
                <div className="loading-days">
                    <DayOfWeekCard value="Loading data..."/>
                </div>
            );
        } else {
            
            return data.dayOfWeeks.map((dayOfWeek) => {
                return (

                    
                        <DayOfWeekCard value={dayOfWeek}/>
                    
                    // <section className="day-of-week" key={dayOfWeek._id}>
                    //     {this.displayDayOfWeek(dayOfWeek)}
                    // </section>
                );
            });
        }
    }
  	render () {    
    	return (
            <div>
                <ListGroup className="day-cards">
                    {this.displayDayOfWeeks()}
                </ListGroup>
            </div>
    	);
  	}
}

export default graphql(getDayOfWeeksQuery)(DayOfWeeks);
