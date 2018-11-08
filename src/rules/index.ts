export const requiredRule = (value: string | boolean): boolean => !!value;

export const lengthRule = (l: number) => (v: string): boolean =>
  !!v && v.length >= l;

export const equalityRule = (
  fieldValue_1: string,
  fieldValue_2: string
): boolean => fieldValue_1 === fieldValue_2;
