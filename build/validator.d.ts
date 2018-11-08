import { FieldsDescription, FormValidationState, ValidateReturn, ErrorMessages, FormattedFieldsDescription } from './types';
/**
 * A simple class for fields validation based on their state object (like in React.js local state)
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 * @author Igor Ivanov <i.ivanov@nullgr.com>
 */
declare class Validator<State> {
    validationDescription: FormattedFieldsDescription;
    validationState: FormValidationState;
    isInitValidationStateSet: boolean;
    errors: ErrorMessages;
    constructor(fields: FieldsDescription);
    private updateValidationStatuses(partialValidationState);
    private updateDependencyValidationStatuses(statuses, fieldDescripton);
    private findFirstFailedRuleMessage(fieldDescripton, statuses);
    private getFieldDependencyStatuses(fieldState, fieldDescription);
    private validateField(fieldValue, fieldRules);
    private validateFieldDependencies(fieldValue, fieldDependencyRules, actualValidationState);
    setInitialValues(state: State): State;
    validate(state: State): ValidateReturn;
    isFormValid(): boolean;
}
export default Validator;
