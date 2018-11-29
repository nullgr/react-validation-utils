var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { findDifference } from './modules';
/**
 * A simple class for fields validation based on their state object (like in React.js local state)
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 * @author Igor Ivanov <i.ivanov@nullgr.com>
 */
var Validator = /** @class */ (function () {
    function Validator(fields) {
        if (typeof fields !== 'object') {
            throw new Error('Invalid fields parameter for fields, must be object');
        }
        // errors object
        this.errors = {};
        // { rules, message } Objects
        this.validationDescription = fields;
        // { value, showError, statuses } Objects
        this.validationState = {};
        // if setInitialValues was called checkinng
        this.isInitValidationStateSet = false;
    }
    /* PRIVATE METHODS */
    Validator.prototype.updateValidationStatuses = function (partialValidationState) {
        var _this = this;
        Object.keys(partialValidationState).forEach(function (fieldName) {
            debugger;
            var currentFieldState = partialValidationState[fieldName];
            var currentFieldDescription = _this.validationDescription[fieldName];
            var validatedStatuses = _this.validateField(currentFieldState.value, currentFieldDescription);
            var validatedDependencyStatuses = _this.getFieldDependencyStatuses(currentFieldState, currentFieldDescription);
            // Updating statuses
            currentFieldState.statuses = validatedStatuses.concat(validatedDependencyStatuses);
            debugger;
            if (validatedDependencyStatuses.length !== 0 &&
                validatedDependencyStatuses.indexOf(false) !== -1) {
                _this.updateDependencyValidationStatuses(validatedDependencyStatuses, currentFieldDescription);
            }
            // console.log(validatedDependencyStatuses, currentFieldState.statuses);
            // Updating errors
            _this.errors[fieldName] = currentFieldState.showError
                ? _this.findFirstFailedRuleMessage(currentFieldDescription, validatedStatuses)
                : '';
        });
        console.log(this.validationState);
    };
    Validator.prototype.updateDependencyValidationStatuses = function (statuses, fieldDescripton) {
        console.log(statuses, fieldDescripton);
        var failedRuleIndex = statuses.indexOf(false);
        debugger;
        if (failedRuleIndex !== -1) {
            // TODO fix special case - [0] array element
            var dependedFieldName = fieldDescripton[0].dependencies[failedRuleIndex].fieldName;
            var dependedField = {};
            dependedField[dependedFieldName] = this.validationState[dependedFieldName];
            console.log(dependedField);
        }
        debugger;
    };
    Validator.prototype.getFieldDependencyStatuses = function (fieldState, fieldDescription) {
        var _this = this;
        var dependencyStatuses = [];
        // Check if field depends on another
        fieldDescription.forEach(function (item) {
            debugger;
            if (item.hasOwnProperty('dependencies')) {
                dependencyStatuses = _this.validateFieldDependencies(fieldState.value, item.dependencies, _this.validationState);
            }
        });
        debugger;
        return dependencyStatuses;
    };
    Validator.prototype.validateFieldDependencies = function (fieldValue, fieldDependencyRules, actualValidationState) {
        return fieldDependencyRules.map(function (item) {
            return item.rule(fieldValue, actualValidationState[item.fieldName].value);
        });
    };
    Validator.prototype.validateField = function (fieldValue, fieldRules) {
        return fieldRules.map(function (item) { return item.rule(fieldValue); });
    };
    Validator.prototype.findFirstFailedRuleMessage = function (fieldDescripton, statuses) {
        return statuses.indexOf(false) === -1
            ? ''
            : fieldDescripton[statuses.indexOf(false)].message;
    };
    /* END OF PRIVATE METHODS */
    Validator.prototype.setInitialValues = function (state) {
        var _this = this;
        Object.keys(this.validationDescription).forEach(function (fieldName) {
            if (typeof state[fieldName] === 'undefined') {
                throw new Error("It seems that you didn't passed a field '" + fieldName + "' value");
            }
            // Initial errors object formation
            _this.errors[fieldName] = _this.validationDescription[fieldName][0].message;
            // Initial validation state object formation
            _this.validationState[fieldName] = {
                value: state[fieldName],
                showError: false,
                statuses: []
            };
        });
        this.updateValidationStatuses(this.validationState);
        // Initial validation has been launched, so - flag = true
        this.isInitValidationStateSet = true;
        return state;
    };
    Validator.prototype.validate = function (state) {
        if (!this.isInitValidationStateSet) {
            this.setInitialValues(state);
        }
        else {
            var changedField = findDifference(state, this.validationState);
            if (Object.keys(changedField).length !== 0) {
                // TODO something because of sequence of two control constructures below
                this.validationState = __assign({}, this.validationState, changedField);
                this.updateValidationStatuses(changedField);
            }
        }
        return { errors: this.errors };
    };
    Validator.prototype.isFormValid = function () {
        var isFormValid = true;
        Object.values(this.validationState).forEach(function (field) {
            // console.log(field, field.statuses);
            if (field.statuses.indexOf(false) !== -1)
                isFormValid = false;
        });
        return isFormValid;
    };
    return Validator;
}());
export default Validator;
