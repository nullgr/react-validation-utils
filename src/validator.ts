import {
  RuleData,
  DependencyRuleData,
  FieldsDescription,
  FieldValidationState,
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
  validationDescription: FormattedFieldsDescription;
  validationState: FormValidationState;
  isInitValidationStateSet: boolean;
  errors: ErrorMessages;

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

  /* PRIVATE METHODS */

  private updateValidationStatuses(
    partialValidationState: FormValidationState
  ) {
    Object.keys(partialValidationState).forEach(fieldName => {
      debugger;
      const currentFieldState = partialValidationState[fieldName];
      const currentFieldDescription = this.validationDescription[fieldName];

      const validatedStatuses = this.validateField(
        currentFieldState.value,
        currentFieldDescription
      );

      const validatedDependencyStatuses = this.getFieldDependencyStatuses(
        currentFieldState,
        currentFieldDescription
      );

      // Updating statuses
      currentFieldState.statuses = [
        ...validatedStatuses,
        ...validatedDependencyStatuses
      ];
      debugger;

      if (validatedDependencyStatuses.indexOf(false) !== -1) {
        this.updateDependencyValidationStatuses(
          validatedDependencyStatuses,
          currentFieldDescription
        );
      }

      // console.log(validatedDependencyStatuses, currentFieldState.statuses);

      // Updating errors
      this.errors[fieldName] = currentFieldState.showError
        ? this.findFirstFailedRuleMessage(
            currentFieldDescription,
            validatedStatuses
          )
        : '';
    });
    console.log(this.validationState);
  }

  private updateDependencyValidationStatuses(
    statuses: Array<void | boolean>,
    fieldDescripton: RuleData[]
  ) {
    console.log(statuses, fieldDescripton);
    const failedRuleIndex = statuses.indexOf(false);
    debugger;
    if (failedRuleIndex !== -1) {
      // TODO fix special case - [0] array element
      const dependedFieldName =
        fieldDescripton[0].dependencies[failedRuleIndex].fieldName;
      const dependedField = {};

      dependedField[dependedFieldName] = this.validationState[
        dependedFieldName
      ];

      console.log(dependedField);
    }
    debugger;
  }

  private getFieldDependencyStatuses(
    fieldState: FieldValidationState,
    fieldDescription: RuleData[]
  ): Array<void | boolean> {
    let dependencyStatuses: Array<void | boolean> = [];

    // Check if field depends on another
    fieldDescription.forEach((item: any) => {
      debugger;

      if (item.hasOwnProperty('dependencies')) {
        dependencyStatuses = this.validateFieldDependencies(
          fieldState.value,
          item.dependencies,
          this.validationState
        );
      }
    });
    debugger;

    return dependencyStatuses;
  }

  private validateFieldDependencies(
    fieldValue: string,
    fieldDependencyRules: DependencyRuleData[],
    actualValidationState: FormValidationState
  ): Array<boolean> {
    return fieldDependencyRules.map(item =>
      item.rule(fieldValue, actualValidationState[item.fieldName].value)
    );
  }

  private validateField(
    fieldValue: string,
    fieldRules: RuleData[]
  ): Array<boolean> {
    return fieldRules.map(item => item.rule(fieldValue));
  }

  private findFirstFailedRuleMessage(
    fieldDescripton: RuleData[],
    statuses: boolean[]
  ): string {
    return statuses.indexOf(false) === -1
      ? ''
      : fieldDescripton[statuses.indexOf(false)].message;
  }

  /* END OF PRIVATE METHODS */

  setInitialValues(state: State): State {
    Object.keys(this.validationDescription).forEach(fieldName => {
      if (typeof state[fieldName] === 'undefined') {
        throw new Error(
          `It seems that you didn't passed a field '${fieldName}' value`
        );
      }

      // Initial errors object formation
      this.errors[fieldName] = this.validationDescription[fieldName][0].message;

      // Initial validation state object formation
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
      // console.log(field, field.statuses);
      if (field.statuses.indexOf(false) !== -1) isFormValid = false;
    });

    return isFormValid;
  }
}

export default Validator;
