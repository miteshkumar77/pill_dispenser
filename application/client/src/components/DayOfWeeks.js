import React, { Component } from 'react'; 
import { graphql } from 'react-apollo';

// queries
import { getDayOfWeeksQuery } from '../queries/queries'; 

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
            return (<h2 id="loading">Loading data...</h2>);
        } else {
            
            return data.dayOfWeeks.map((dayOfWeek) => {
                return (
                    <section id="day-of-week" key={dayOfWeek._id}>
                        {this.displayDayOfWeek(dayOfWeek)}
                    </section>
                );
            });
        }
    }
  	render () {    
    	return (
            <div>
                {this.displayDayOfWeeks()}
            </div>
    	);
  	}
}

export default graphql(getDayOfWeeksQuery)(DayOfWeeks);
