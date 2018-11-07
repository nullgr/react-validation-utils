import Validator from './validator';
// Represents Public API of library, every method presented there
// may be used by user and should be described in README file
//
// Separating of Public Api and Validator gives next benefits:
//  1) User of library have access only to Public API but not to implementation details
//  2) At the same time inner details of Validator are easy testable
//  3) Also small benefit: in Validator we declare methods on prototype, but not on actual function -
//     this is useful for reducing of initial render time,
//     if project have a lot of forms(therefore a lot of instances of Validator object)
var ValidationPublicApi = function (fields) {
    var validator = new Validator(fields);
    this.validate = function (state) {
        return validator.validate(state);
    };
    this.isFormValid = function () {
        return validator.isFormValid();
    };
};
export default ValidationPublicApi;
