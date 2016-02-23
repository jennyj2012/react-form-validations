import React, { Component } from 'react';

export class Input extends Component {
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

  inputProps() {
    var { inputClassNames, values, value, className, ...other } = this.props;
    var className = this.className(), value = this.value();
    var props = Object.assign({}, other, { className });
    if (this.props.type === "checkbox") {
      props.checked = value;
    } else {
      props.value = value;
    }
    return props;
  }

  render() {
    return <input {...this.inputProps()} />;
  }
}

Input.propTypes = {
  type: React.PropTypes.string.isRequired,
  name: React.PropTypes.string
};
