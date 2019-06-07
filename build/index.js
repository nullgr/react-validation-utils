"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * FieldsDescription type for using it in constructor
 * you can use both, object or array of objects with RuleData
 */

/**
 * FieldsDescription type for using it in under the hood, each ruleData is 100% an array
 */

/**
 * A class for fields validation in React.js
 * Use it in your React components for forms,
 * The form should work the classical way,
 * store fields in the local component state and modify fields using this.setState method
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
var Validation =
/*#__PURE__*/
function () {
  function Validation(fields) {
    var validationStorageName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'validationStorage';

    _classCallCheck(this, Validation);

    if (_typeof(fields) !== 'object') {
      throw new Error('Invalid fields parameter for fields, must be object');
    }

    this.fields = allRulesInArrays(fields);
    this.fieldsToValidateList = [];
    this.fieldsToShowErrors = [];
    this.validationStorageName = validationStorageName;
    this.statuses = ['validation-passed', 'prevalidation-failed', 'validation-failed'];
  }

  _createClass(Validation, [{
    key: "_validateField",
    value: function _validateField(fieldValue, fieldRules, state, showErrors) {
      var _this$statuses = _slicedToArray(this.statuses, 3),
          validationPassed = _this$statuses[0],
          prevalidationFailed = _this$statuses[1],
          validationFailed = _this$statuses[2]; // validate every rule


      return fieldRules.map(function (item) {
        return item.rule(fieldValue, state) ? validationPassed : showErrors ? validationFailed : prevalidationFailed;
      });
    }
  }, {
    key: "addValidation",
    value: function addValidation(state) {
      var _this = this;

      var showErrorsOnStart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (_typeof(state) !== 'object') {
        throw new Error('Invalid state parameter for fields, must be object');
      }

      var toStorage = {};
      Object.keys(this.fields).map(function (key) {
        return toStorage[key] = _this._validateField(state[key], _this.fields[key], state, showErrorsOnStart);
      });
      return Object.assign(state, _defineProperty({}, this.validationStorageName, toStorage));
    }
    /**
     * Validate is a method to use inside the setState function
     */

  }, {
    key: "validate",
    value: function validate(stateUpdates) {
      var _this2 = this;

      var showErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var showErrorsHash = {};
      var showChoosenErrors = false;
      var fieldsToValidateList = [];

      if (this.fieldsToValidateList.length > 0) {
        fieldsToValidateList = this.fieldsToValidateList;
        this.fieldsToValidateList = [];
      }

      if (this.fieldsToShowErrors.length > 0) {
        showChoosenErrors = true;
        this.fieldsToShowErrors.forEach(function (f) {
          return showErrorsHash[f] = true;
        });
        this.fieldsToShowErrors = [];
      }

      return function (prevState, props) {
        if (typeof stateUpdates === 'function') {
          // support of updater function
          stateUpdates = stateUpdates(prevState, props);
        }

        var keysToValidate = fieldsToValidateList.length > 0 ? fieldsToValidateList : stateUpdates ? Object.keys(stateUpdates) : Object.keys(_this2.fields);
        var toStorage = {}; // computing the state as a merge from prevState and stateUpdates to do the right validation

        var state = Object.assign({}, prevState, stateUpdates || {}); // clean the service error storage field, so the rule will have no acces to it

        delete state[_this2.validationStorageName];
        keysToValidate.map(function (key) {
          if (_this2.fields[key]) {
            toStorage[key] = _this2._validateField(state[key], _this2.fields[key], prevState, showChoosenErrors ? showErrorsHash[key] : showErrors);
          }
        });
        _this2.fieldsToShowErrors = [];
        return Object.assign(stateUpdates || {}, _defineProperty({}, _this2.validationStorageName, Object.assign({}, prevState[_this2.validationStorageName], toStorage)));
      };
    }
  }, {
    key: "updateRules",
    value: function updateRules(updatedRules) {
      var _this3 = this;

      Object.keys(updatedRules).map(function (k) {
        if (_this3.fields[k]) {
          var rulesToUpdate = Object.keys(updatedRules[k]);
          rulesToUpdate.forEach(function (ruleId) {
            var ruleIndex = -1;

            _this3.fields[k].forEach(function (f, i) {
              if (f.id && f.id === ruleId) {
                ruleIndex = i;
              }
            });

            if (ruleIndex !== -1) {
              _this3.fields[k][ruleIndex].rule = updatedRules[k][ruleId];
            }
          });
        }
      });
      return this;
    }
  }, {
    key: "fieldsToValidate",
    value: function fieldsToValidate(fieldsList) {
      this.fieldsToValidateList = _toConsumableArray(fieldsList);
      return this;
    }
  }, {
    key: "showErrorsOnFields",
    value: function showErrorsOnFields(fieldsList) {
      this.fieldsToShowErrors = _toConsumableArray(fieldsList);
      return this;
    }
  }, {
    key: "getErrors",
    value: function getErrors(state) {
      var _this4 = this;

      var keys = Object.keys(this.fields),
          objErrors = {};
      var validationFailed = this.statuses[2];
      keys.map(function (key) {
        var current = state[_this4.validationStorageName][key]; // check every rule

        for (var i = 0; i < current.length; i++) {
          if (current[i] === validationFailed) {
            // always return the first failed rule error
            objErrors[key] = _this4.fields[key][i].message;
            return;
          }
        }

        objErrors[key] = '';
        return;
      });
      return objErrors;
    }
  }, {
    key: "isFormValid",
    value: function isFormValid(state) {
      var storage = state[this.validationStorageName];

      if (_typeof(state) !== 'object') {
        throw new Error('Invalid state parameter, must be object');
      }

      if (_typeof(storage) !== 'object') {
        throw new Error('Invalid storage object, must be object');
      }

      var keys = Object.keys(storage);

      var _this$statuses2 = _slicedToArray(this.statuses, 1),
          validationPassed = _this$statuses2[0];

      for (var i = 0; i < keys.length; i++) {
        var currentStatuses = storage[keys[i]];

        for (var j = 0; j < currentStatuses.length; j++) {
          if (currentStatuses[j] !== validationPassed) {
            return false;
          }
        }
      } // if form valid return true


      return true;
    }
  }, {
    key: "isFieldValid",
    value: function isFieldValid(state, fieldName) {
      var storage = state[this.validationStorageName];

      if (_typeof(state) !== 'object') {
        throw new Error('Invalid state parameter, must be object');
      }

      if (_typeof(storage) !== 'object') {
        throw new Error('Invalid storage object, must be object');
      }

      var fieldStatuses = storage[fieldName];

      if (!fieldStatuses) {
        return false;
      }

      var _this$statuses3 = _slicedToArray(this.statuses, 1),
          validationPassed = _this$statuses3[0];

      for (var j = 0; j < fieldStatuses.length; j++) {
        if (fieldStatuses[j] !== validationPassed) {
          return false;
        }
      }

      return true;
    }
  }]);

  return Validation;
}();

var allRulesInArrays = function allRulesInArrays(fields) {
  var formattedFields = {};
  Object.keys(fields).forEach(function (field) {
    formattedFields[field] = Array.isArray(fields[field]) ? _toConsumableArray(fields[field]) : [fields[field]];
  });
  return formattedFields;
};

var _default = Validation;
exports["default"] = _default;