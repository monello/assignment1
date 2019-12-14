import React from 'react';
import DatePicker from "react-datepicker";
import {MDBIcon} from "mdbreact";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.css"

const CustomDatePicker = (props) => (
    <div className="CustomDatePicker md-form form-group">
        <MDBIcon icon="calendar-alt" size="2x"/>
        <DatePicker
            name={props.name}
            dateFormat="yyyy/MM/dd"
            placeholderText={props.placeholder}
            selected={props.selectedDate}
            onChange={props.changeHandler}
        />
    </div>
);

export default CustomDatePicker;