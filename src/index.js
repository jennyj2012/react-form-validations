import React, { Component } from 'react';

const presence = (field, values) => {
  const val = values[field];
  if (typeof val === "undefined" || (typeof val === "string" && !val)) {
    return "can't be blank";
  } else {
    return "";
  }
};

const confirmation = (field, values) => {
  const val = values[field];
  const confirmVal = values[`${field}_confirmation`];
  if (val !== confirmVal) {
    return "must match confirmation";
  } else {
    return "";
  }
}

const length = (field, values, minLength = 6) => {
  const val = values[field];
  if (typeof val === "string" && val.length < minLength) {
    return `must be at least ${minLength} characters`;
  } else {
    return "";
  }
}

export const defaultValidators = { presence, confirmation, length };

export class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {values: this.props.initialValues || {}, errors: {}};
    this.setValidators(props);
  }

  setValidators(props) {
    this.validators = {};
    const { validators } = props;
    if (!validators) return;
    for (var field in validators) {
      this.validators[field] = [];
      validators[field].forEach(validator => {
        if (typeof validator === "string") {
          this.validators[field].push(defaultValidators[validator]);
        } else if (typeof validator === "function") {
          this.validators[field].push(validator);
        }
      }, this)
    }
    console.log(this.validators);
  }

  onChange(event) {
    var {name, type, value, checked} = event.target;
    if (!name) return;
    if (type === "checkbox") value = checked;
    this.state.values[name] = value;
    this.forceUpdate();
  }

  onSubmit(event) {
    event.preventDefault();
    this.performValidations();
    if (!this.anyErrors()) this.props.submit(this.state.values);
  }

  performValidations() {
    var values = this.state.values, errors = {};
    for (var field in this.validators) {
      errors[field] = [];
      this.validators[field].forEach(validator => {
        var message = validator(field, values);
        if (message) errors[field].push(message);
      });
    }
    this.state.errors = errors;
    this.forceUpdate();
  }

  errorMessages() {
    var messages = [], errors = this.state.errors;
    for (var field in errors) {
      if (errors[field].length) {
        errors[field].forEach(message => {
          messages.push(`${field.split("_").join(" ")} ${message}`);
        });
      }
    }
    return messages;
  }

  renderErrors() {
    const messages = this.errorMessages();
    if (!messages.length) return null;
    return (
      <ul className="errors">
        {messages.map((message, idx) => {
          return <li key={idx}>{message}</li>;
        })}
      </ul>
    );
  }

  hasError(name) {
    var errors = this.state.errors[name];
    return errors && errors.length;
  }

  anyErrors() {
    for (var name in this.state.errors) {
      if (this.hasError(name)) return true;
    }
    return false;
  }

  inputClassName(name) {
    return this.hasError(name) ? "error" : "";
  }

  inputClassNames() {
    var classNames = {};
    for (var name in this.state.values) {
      classNames[name] = this.inputClassName(name);
    }
    return classNames;
  }

  render() {
    const { className } = this.props;
    const inputClassNames = this.inputClassNames(), values = this.state.values;
    const childProps = { inputClassNames, values };

    return (
      <form
        className={className}
        onSubmit={this.onSubmit.bind(this)}
        onChange={this.onChange.bind(this)}
      >
        {this.renderErrors()}
        {React.Children.map(this.props.children, (child) => {
          return React.cloneElement(child, childProps);
        })}
      </form>
    );
  }
}

Form.propTypes = {
  submit: React.PropTypes.func.isRequired,
  className: React.PropTypes.string,
  initialValues: React.PropTypes.object,
  validators: React.PropTypes.object
};

export class Input extends Component {
  className() {
    const {inputClassNames, className, name} = this.props;
    var result = "";
    if (inputClassNames && inputClassNames[name]) result += inputClassNames[name];
    if (className) result += " " + className;
    return result;
  }

  value() {
    const {value, values, name} = this.props;
    if (value) return value;
    return values[name];
  }

  inputProps() {
    var { inputClassNames, values, className, ...other } = this.props;
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
  name: React.PropTypes.string.isRequired,
  inputClassNames: React.PropTypes.object,
  values: React.PropTypes.object,
  className: React.PropTypes.string
};
