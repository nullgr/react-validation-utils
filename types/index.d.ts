type Rule = (val: any, state: object) => boolean;

type RuleData = {
  rule: Rule;
  message: string;
  id?: string;
};

type FieldsDescription = {
  [key: string]: RuleData | RuleData[];
};

type updaterFunction<T> = (prevState: Readonly<T>) => T;

export default class Validator<State> {
  constructor(fields: FieldsDescription, validationStorageName?: string);

  // 'State' type in methods below is right only in argument of addValidation method
  //
  // In all another methods 'State' type is incorrect,
  // in real scenario it contains one more field [validationStorageName]
  //
  // In most cases user of library shouldn't care about [validationStorageName] field
  // in component state, so this inaccuracy isn't very serious, but at the same time
  // it simplifies the use of library

  addValidation(state: State, showErrorsOnStart?: boolean): Readonly<State>;

  validate(
    stateUpdates?: Partial<State> | updaterFunction<State> | null,
    showErrors?: boolean
  ): ((prevState: Readonly<State>) => State);

  getErrors(state: State): { [key in keyof State]: string };

  isFormValid(state: State): boolean;

  isFieldValid(state: State, fieldName: string): boolean;

  updateRules(updaterParams: any): this;

  fieldsToValidate(updaterParams: any): this;

  showErrorsOnFields(updaterParams: any): this;

}
