"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = exports.Form = exports.defaultValidators = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var presence = function presence(field, values) {
  var val = values[field];
  if (typeof val === "undefined" || typeof val === "string" && !val) {
    return "can't be blank";
  } else {
    return "";
  }
};

var confirmation = function confirmation(field, values) {
  var val = values[field];
  var confirmVal = values[field + "_confirmation"];
  if (val !== confirmVal) {
    return "must match confirmation";
  } else {
    return "";
  }
};

var defaultValidators = exports.defaultValidators = { presence: presence, confirmation: confirmation };

var Form = exports.Form = function (_Component) {
  _inherits(Form, _Component);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Form).call(this, props));

    _this.state = { values: _this.props.initialValues || {}, errors: {} };
    _this.setValidators(props);
    return _this;
  }

  _createClass(Form, [{
    key: "setValidators",
    value: function setValidators(props) {
      var _this2 = this;

      this.validators = {};
      var validators = props.validators;

      if (!validators) return;
      for (var field in validators) {
        this.validators[field] = [];
        validators[field].forEach(function (validator) {
          if (typeof validator === "string") {
            _this2.validators[field].push(defaultValidators[validator]);
          } else if (typeof validator === "function") {
            _this2.validators[field].push(validator);
          }
        }, this);
      }
      console.log(this.validators);
    }
  }, {
    key: "onChange",
    value: function onChange(event) {
      var _event$target = event.target;
      var name = _event$target.name;
      var type = _event$target.type;
      var value = _event$target.value;
      var checked = _event$target.checked;

      if (!name) return;
      if (type === "checkbox") value = checked;
      this.state.values[name] = value;
      this.forceUpdate();
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(event) {
      event.preventDefault();
      this.performValidations();
      if (!this.anyErrors()) this.props.submit(this.state.values);
    }
  }, {
    key: "performValidations",
    value: function performValidations() {
      var values = this.state.values,
          errors = {};
      for (var field in this.validators) {
        errors[field] = [];
        this.validators[field].forEach(function (validator) {
          var message = validator(field, values);
          if (message) errors[field].push(message);
        });
      }
      this.state.errors = errors;
      this.forceUpdate();
    }
  }, {
    key: "errorMessages",
    value: function errorMessages() {
      var messages = [],
          errors = this.state.errors;
      for (var field in errors) {
        if (errors[field].length) {
          errors[field].forEach(function (message) {
            messages.push(field.split("_").join(" ") + " " + message);
          });
        }
      }
      return messages;
    }
  }, {
    key: "renderErrors",
    value: function renderErrors() {
      var messages = this.errorMessages();
      if (!messages.length) return null;
      return _react2.default.createElement(
        "ul",
        { className: "errors" },
        messages.map(function (message, idx) {
          return _react2.default.createElement(
            "li",
            { key: idx },
            message
          );
        })
      );
    }
  }, {
    key: "hasError",
    value: function hasError(name) {
      var errors = this.state.errors[name];
      return errors && errors.length;
    }
  }, {
    key: "anyErrors",
    value: function anyErrors() {
      for (var name in this.state.errors) {
        if (this.hasError(name)) return true;
      }
      return false;
    }
  }, {
    key: "inputClassName",
    value: function inputClassName(name) {
      return this.hasError(name) ? "error" : "";
    }
  }, {
    key: "inputClassNames",
    value: function inputClassNames() {
      var classNames = {};
      for (var name in this.state.values) {
        classNames[name] = this.inputClassName(name);
      }
      return classNames;
    }
  }, {
    key: "render",
    value: function render() {
      var className = this.props.className;

      var inputClassNames = this.inputClassNames(),
          values = this.state.values;
      var childProps = { inputClassNames: inputClassNames, values: values };

      return _react2.default.createElement(
        "form",
        {
          className: className,
          onSubmit: this.onSubmit.bind(this),
          onChange: this.onChange.bind(this)
        },
        this.renderErrors(),
        _react2.default.Children.map(this.props.children, function (child) {
          return _react2.default.cloneElement(child, childProps);
        })
      );
    }
  }]);

  return Form;
}(_react.Component);

Form.propTypes = {
  submit: _react2.default.PropTypes.func.isRequired,
  className: _react2.default.PropTypes.string,
  initialValues: _react2.default.PropTypes.object,
  validators: _react2.default.PropTypes.object
};

var Input = exports.Input = function (_Component2) {
  _inherits(Input, _Component2);

  function Input() {
    _classCallCheck(this, Input);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Input).apply(this, arguments));
  }

  _createClass(Input, [{
    key: "className",
    value: function className() {
      var _props = this.props;
      var inputClassNames = _props.inputClassNames;
      var className = _props.className;
      var name = _props.name;

      var result = "";
      if (inputClassNames && inputClassNames[name]) result += inputClassNames[name];
      if (className) result += " " + className;
      return result;
    }
  }, {
    key: "value",
    value: function value() {
      var _props2 = this.props;
      var value = _props2.value;
      var values = _props2.values;
      var name = _props2.name;

      if (value) return value;
      return values[name];
    }
  }, {
    key: "inputProps",
    value: function inputProps() {
      var _props3 = this.props;
      var inputClassNames = _props3.inputClassNames;
      var values = _props3.values;
      var className = _props3.className;

      var other = _objectWithoutProperties(_props3, ["inputClassNames", "values", "className"]);

      var className = this.className(),
          value = this.value();
      var props = Object.assign({}, other, { className: className });
      if (this.props.type === "checkbox") {
        props.checked = value;
      } else {
        props.value = value;
      }
      return props;
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement("input", this.inputProps());
    }
  }]);

  return Input;
}(_react.Component);

Input.propTypes = {
  type: _react2.default.PropTypes.string.isRequired,
  name: _react2.default.PropTypes.string.isRequired,
  inputClassNames: _react2.default.PropTypes.object,
  values: _react2.default.PropTypes.object,
  className: _react2.default.PropTypes.string
};
