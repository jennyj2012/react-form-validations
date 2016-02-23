# React Form Validations

## Get Started
`npm install --save react-form-validations`

## Basic Usage
react-form-validations gives you Form, Input, and Select components.  
Form needs validators object and submit function.
```javascript
import React, { Component } from 'react';
import { Form, Input, Select } from 'react-form-validations';

class SignUpForm extends Component {
  render() {
    return (
      <Form submit={this.props.signUp} validators={this.validators}>
        <Input type="email" name="email" placeholder="Email" />
        <Select name="gender" options={["", "male", "female"]} />
        <Input type="password" name="password" placeholder="Password" />
        <Input type="password" name="password_confirmation" placeholder="Confirm" />
        <Input type="submit" value="Sign up" />
      </Form>
    );
  }
}

SignUpForm.prototype.validators = {
  email: ["presence"],
  gender: ["presence"],
  password: ["presence", "length", "confirmation"],
  password_confirmation: ["presence"]
};
```
Built in validations include presence, length, and confirmation.

## Custom Validations
Validators can also be functions of the form `(value, values, field) => message`.  
Where message is a string and a blank string indicates no error.
```javascript
  const PHONE_REGEX = /^\(\d{3}\) \d{3}\-\d{4}$/
  const phoneValidator = (value) => {
    if (PHONE_REGEX.test(value)) return "";
    return "must be in the form (000) 000-0000";
  };

  <Form validators={{phone: [phoneValidator]}} submit={this.props.signUp}>
  ...
```

## Styling
Errors are displayed at the top of the form in `ul.validation-errors`.  
Inputs with errors are given the class `.validation-error`.  
See the css folder for an example.  

## Wrapping Inputs
Form syncs state with Input by passing down `values` and `inputClassNames` as props.  
If you are going to wrap your Input with an element it too needs to pass these down.  
`FormField` does this by wrapping children in a div:

```javascript
import { Form, FormField, Input } from 'react-form-validations';

<FormField className="checkbox-field">
  <label htmlFor="remember-me">Remember me</label>
  <Input type="checkbox" name="remember_me" id="remember-me" />
</FormField>
```

---
Developed by [Ryan Goldenberg](http://ryandgoldenberg.com)
