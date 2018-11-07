import {
  RuleData,
  FieldsDescription,
  FormValidationState,
  ValidateReturn,
  ErrorMessages,
  FormattedFieldsDescription
} from './types';

import { findDifference } from './modules';

/**
 * A simple class for fields validation based on their state object (like in React.js local state)
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 * @author Igor Ivanov <i.ivanov@nullgr.com>
 */

class Validator<State> {
  errors: ErrorMessages;
  validationDescription: FormattedFieldsDescription;
  validationState: FormValidationState;
  isInitValidationStateSet: boolean;

  constructor(fields: FieldsDescription) {
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

  private updateValidationStatuses(
    partialValidationState: FormValidationState
  ) {
    Object.keys(partialValidationState).forEach(fieldName => {
      const currentFieldState = partialValidationState[fieldName];

      const validatedStatuses = this.validateField(
        currentFieldState.value,
        this.validationDescription[fieldName]
      );

      // Updating statuses
      currentFieldState.statuses = validatedStatuses;

      // Updating errors
      this.errors[fieldName] = currentFieldState.showError
        ? this.findFirstFailedRuleMessage(
            this.validationDescription[fieldName],
            validatedStatuses
          )
        : '';
    });
  }

  private findFirstFailedRuleMessage(
    fieldDescripton: RuleData[],
    statuses: boolean[]
  ) {
    return statuses.indexOf(false) === -1
      ? ''
      : fieldDescripton[statuses.indexOf(false)].message;
  }

  private validateField(
    fieldValue: any,
    fieldRules: RuleData[]
  ): Array<boolean> {
    return fieldRules.map(item => {
      return item.rule(fieldValue);
    });
  }

  setInitialValues(state: State): State {
    Object.keys(this.validationDescription).forEach(fieldName => {
      if (typeof state[fieldName] === 'undefined') {
        throw new Error(
          `It seems that you didn't passed a field '${fieldName}' value`
        );
      }

      // Initial errors object formation
      this.errors[fieldName] = this.validationDescription[fieldName][0].message;

      // Initial validation state formation
      this.validationState[fieldName] = {
        value: state[fieldName],
        showError: false,
        statuses: []
      };
    });

    this.updateValidationStatuses(this.validationState);

    // Initial validation has been launched, so - flag = true
    this.isInitValidationStateSet = true;

    return state;
  }

  validate(state: State): ValidateReturn {
    if (!this.isInitValidationStateSet) {
      this.setInitialValues(state);
    } else {
      const changedField = findDifference<State>(state, this.validationState);

      if (Object.keys(changedField).length !== 0) {
        // TODO something because of sequence of two control constructures below
        this.validationState = {
          ...this.validationState,
          ...changedField
        };

        this.updateValidationStatuses(changedField);
      }
    }
    return { errors: this.errors };
  }

  isFormValid(): boolean {
    let isFormValid = true;

    Object.values(this.validationState).forEach(field => {
      if (field.statuses.indexOf(false) !== -1) isFormValid = false;
    });

    return isFormValid;
  }
}

export default Validator;
