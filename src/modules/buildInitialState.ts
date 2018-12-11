import { FormattedFieldsDescription, ValidationState } from '../types';
import { validateFieldsByDiff } from './validateFieldsByDiff'
// TODO add tests here
function buildInitialState<ComponentState> (
  componentState: ComponentState,
  validationDescription: FormattedFieldsDescription
): ValidationState {
  let initialDiff = {};
  let initialState = {};
  Object.keys(validationDescription).forEach(fieldName => {
    if (typeof componentState[fieldName] === 'undefined') {
      throw new Error(
        `It seems that you didn't passed a field '${fieldName}' value`
      );
    }
    initialDiff[fieldName] = componentState[fieldName];
    initialState[fieldName] = {
      value: componentState[fieldName],
      showError: false,
      statuses: []
    };
    });
  return validateFieldsByDiff(
    initialDiff,
    initialState,
    validationDescription,
    false   
  );
}
export { buildInitialState };