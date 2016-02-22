import React, { Component } from 'react';
import * as defaultValidators from './validators';

const formatField = (field) => {
  return field.replace(/_/g, " ").replace(/[A-Z]/g, letter => {
    return ` ${letter.toLowerCase()}`;
  });
};

export class Form extends Component {
  constructor(props) {
    super(props);
    this.logWarnings(props);
    this.state = {values: this.props.initialValues || {}, errors: {}};
    this.setValidators(props);
  }

  logWarnings(props) {
    if (typeof props.validators === "undefined")
      console.warn("Please supply validators to Form");
    if (typeof props.initialValues === "undefined")
      console.warn("Please supply initialValues to Form");
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
      }, this);
    }
  }

  onChange(event) {
    var { name, type, value, checked } = event.target;
    if (typeof name !== "string") return;
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
    var values = this.state.values, errors = {}, value;
    for (var field in this.validators) {
      errors[field] = [];
      value = values[field];
      this.validators[field].forEach(validator => {
        var message = validator(value, values, field);
        if (message) errors[field].push(message);
      });
    }
    this.state.errors = errors;
    this.forceUpdate();
  }

  errorMessages() {
    var messages = [], errors = this.state.errors, formattedField;
    for (var field in errors) {
      if (errors[field].length) {
        formattedField = formatField(field);
        errors[field].forEach(message => {
          messages.push(`${formattedField} ${message}`);
        });
      }
    }
    return messages;
  }

  renderErrors() {
    const messages = this.errorMessages();
    if (!messages.length) return null;
    return (
      <ul className="validation-errors">
        {messages.map((message, idx) => {
          return <li key={idx}>{message}</li>;
        })}
      </ul>
    );
  }

  hasError(name) {
    var errors = this.state.errors[name];
    return !!(errors && errors.length);
  }

  anyErrors() {
    for (var name in this.state.errors) {
      if (this.hasError(name)) return true;
    }
    return false;
  }

  inputClassName(name) {
    return (this.hasError(name) ? "validation-error" : "");
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
  initialValues: React.PropTypes.object,
  validators: React.PropTypes.object
};
