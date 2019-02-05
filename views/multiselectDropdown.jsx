import React from 'react'
const { Component, Children, PropTypes } = React
import { Select, Option, utils } from '../node_modules/selectly/dist/selectly.js'
const { getToggledValues } = utils  

class CheckboxOption extends Component {
  render() {
    const { value, isChecked, children } = this.props
    return (
      <Option className="react-select-option" value={value}>
        <input
          type="checkbox"
          className="react-select-option__checkbox"
          defaultValue={null}
          checked={isChecked}
        />
        <div className="react-select-option__label">
          {children}
        </div>
      </Option>
    )
  }
}

