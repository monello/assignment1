import React from 'react';

const SelectInput = (props) => {
    const required = props.required ? 'required' : null;
    return (
        <div className="md-form form-group">
            <select
                onChange={props.onChange}
                name={props.name}
                required={required}
                value={props.selected}
                className="browser-default custom-select">
                {props.children}
            </select>
        </div>
    )
};

export default SelectInput;