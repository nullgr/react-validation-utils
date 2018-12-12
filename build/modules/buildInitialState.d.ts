import { FormattedFieldsDescription, ValidationState, InsertedArgs } from '../types';
declare function buildInitialState<ComponentState>(componentState: ComponentState, validationDescription: FormattedFieldsDescription, insertedArgs: InsertedArgs, ruleIdsInFields: any): ValidationState;
export { buildInitialState };
