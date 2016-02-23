import React, { Component } from 'react';

export class Select extends Component {
  className() {
    const { inputClassNames, className, name } = this.props;
    var result = "";
    if (inputClassNames[name]) result += inputClassNames[name];
    if (className) result += " " + className;
    return result.trim();
  }

  value() {
    const { value, values, name } = this.props;
    if (typeof value !== "undefined") return value;
    return values[name];
  }

  selectProps() {
    var { inputClassNames, values, value, className, children, options, ...other } = this.props;
    var className = this.className(), value = this.value();
    var props = Object.assign({}, other, { className });
    return props;
  }

  renderOptions() {
    const { options } = this.props;
    if (!options) return null;
    return options.map((option, idx) => {
      return <option value={option} key={idx}>{option}</option>;
    });
  }

  render() {
    return (
      <select {...this.selectProps()}>
        {this.renderOptions()}
        {this.props.children}
      </select>
    );
  }
}

Select.propTypes = {
  name: React.PropTypes.string.isRequired,
  options: React.PropTypes.array
};
