# React Form Validations

## Get Started
`npm install --save react-form-validations`

## Basic Usage
react-form-validations gives you Form and Input components.  
Form needs validators object and submit function.
```javascript
import React, { Component } from 'react';
import { Form, Input } from 'react-form-validations';

class SignUp extends Component {
  render() {
    return (
      <Form submit={this.props.signUp} validators={this.validators}>
        <Input type="email" name="email" placeholder="Email" />
        <Input type="password" name="password" placeholder="Password" />
        <Input type="password" name="password_confirmation" placeholder="Confirm" />
        <input type="submit" value="Sign up" />
      </Form>
    );
  }
}

SignUp.prototype.validators = {
  email: ["presence"],
  password: ["presence", "length", "confirmation"],
  password_confirmation: ["presence"]
};
```
Built in validations include presence, length, and confirmation.

## Custom Validations
Validators can also be functions of the form `(field, values) => message`.
```javascript
  const PHONE_REGEX = /^\(\d{3}\) \d{3}\-\d{4}$/
  const phoneValidator = (field, values) => {
    const phone = values[field];
    if (PHONE_REGEX.test(phone)) {
      return "";
    } else {
      return "must be in the form (XXX) XXX-XXXX";
    }
  }
```

## Styling
Errors are displayed at the top of the form in `ul.errors`

---
Developed by [Ryan Goldenberg](http://ryandgoldenberg.com)
