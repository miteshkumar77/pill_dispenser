import React from "react";
import Popup from "reactjs-popup";
import AddMedicine from "./AddMedicine";
import { Button } from "react-bootstrap";


export default () => (
    <Popup trigger={<Button variant="success">+ Add Medication </Button>  } closeOnDocumentClick position="bottom left" contentStyle={ { width: '32rem' }}>
        <span> <AddMedicine /> </span>
    </Popup>
    
);

