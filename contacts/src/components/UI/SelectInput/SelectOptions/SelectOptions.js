import React from 'react';

const SelectOptions = (props) => {
    return(
        <React.Fragment>
            {props.placeholder ? <option>{props.placeholder}</option> : null}
            {props.options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
        </React.Fragment>
    )
};

export default SelectOptions;