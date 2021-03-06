define(["require", "exports", 'chai', "./InputParser"], function (require, exports, chai_1, InputParser_1) {
    "use strict";
    describe("InputParser", function () {
        var bestCaseDict = {
            "FieldName": "Priority",
            "Colors": "red;orange;yellow;blue",
            "Values": "0;1;2;3",
            "Labels": "Critical;High;Medium;Low"
        };
        var bestCaseValues = ["1", "2", "3", "4"];
        it("gets the field name specified in dictionary", function () {
            chai_1.expect(InputParser_1.InputParser.getFieldName(bestCaseDict)).to.be.deep.equal("Priority");
        });
        it("throws when field name not specified", function () {
            chai_1.expect(function () { return InputParser_1.InputParser.getFieldName({
                "FieldName": ""
            }); }).throw("FieldName not specified.");
        });
        it("returns an array of interfaces", function () {
            chai_1.expect(InputParser_1.InputParser.getOptions(bestCaseDict, bestCaseValues)).to.be.deep.equal([
                { value: "1", color: "red", label: "Critical" },
                { value: "2", color: "orange", label: "High" },
                { value: "3", color: "yellow", label: "Medium" },
                { value: "4", color: "blue", label: "Low" }]);
        });
        it("returns options with empty strings in label key when no labels are provided", function () {
            chai_1.expect(InputParser_1.InputParser.getOptions({
                "FieldName": "Priority",
                "Colors": "red;orange;yellow;blue",
                "Values": "1;2;3;4",
                "Labels": ""
            }, bestCaseValues)).to.be.deep.equal([
                { value: "1", color: "red", label: "" },
                { value: "2", color: "orange", label: "" },
                { value: "3", color: "yellow", label: "" },
                { value: "4", color: "blue", label: "" }]);
        });
        it("returns 1 default color when 1 value and no colors are provided", function () {
            chai_1.expect(InputParser_1.InputParser.getOptions({
                "FieldName": "Priority",
                "Colors": "",
                "Values": "1",
                "Labels": "Critical"
            }, ["1"])).to.be.deep.equal([
                { value: "1", color: "red", label: "Critical" }]);
        });
        it("returns options with default colors and NO labels when NO colors and NO labels provided.", function () {
            chai_1.expect(InputParser_1.InputParser.getOptions({
                "FieldName": "Priority",
                "Colors": "",
                "Values": "1;2;3;4",
                "Labels": ""
            }, ["1", "2", "3", "4"])).to.be.deep.equal([
                { value: "1", color: "red", label: "" },
                { value: "2", color: "orange", label: "" },
                { value: "3", color: "yellow", label: "" },
                { value: "4", color: "blue", label: "" }]);
        });
        it("throws when allowed values are not specified", function () {
            chai_1.expect(function () { return InputParser_1.InputParser.getOptions({
                "FieldName": "Priority",
                "Colors": "red;orange;yellow;blue",
                "Values": "",
                "Labels": "Critical;High;Medium"
            }, []); }).throw("Allowed values not specified.");
        });
        it("Returns options with some empty labels if less labels than values provided", function () {
            chai_1.expect(InputParser_1.InputParser.getOptions({
                "FieldName": "Priority",
                "Colors": "red;orange;yellow;blue",
                "Values": "1;2;3;4",
                "Labels": "Critical;High;Medium"
            }, ["1", "2", "3", "4"])).to.be.deep.equal([
                { value: "1", color: "red", label: "Critical" },
                { value: "2", color: "orange", label: "High" },
                { value: "3", color: "yellow", label: "Medium" },
                { value: "4", color: "blue", label: "" }]);
        });
        it("throws when less colors than values are provided", function () {
            chai_1.expect(function () { return InputParser_1.InputParser.getOptions({
                "FieldName": "Priority",
                "Colors": "red;orange",
                "Values": "1;2;3;4",
                "Labels": "Critical;High;Medium;Low"
            }, ["1", "2", "3", "4"]); }).throw("Not enough colors provided in admin XML file.");
        });
        it("gives one label to every value, and truncates unused labels when MORE Labels THAN values are provided", function () {
            chai_1.expect(InputParser_1.InputParser.getOptions({
                "FieldName": "Priority",
                "Colors": "red;orange;yellow;blue",
                "Values": "1;2;3;4",
                "Labels": "Critical;High;Medium;Low;Very Low"
            }, ["1", "2", "3", "4"])).to.be.deep.equal([
                { value: "1", color: "red", label: "Critical" },
                { value: "2", color: "orange", label: "High" },
                { value: "3", color: "yellow", label: "Medium" },
                { value: "4", color: "blue", label: "Low" }]);
        });
        it("gives one color to every value, and truncates unused colors when MORE colors THAN values are provided", function () {
            chai_1.expect(InputParser_1.InputParser.getOptions({
                "FieldName": "Priority",
                "Colors": "red;orange;yellow;blue;magenta;deep-blue",
                "Values": "1;2;3;4",
                "Labels": "Critical;High;Medium;Low;Very Low"
            }, ["1", "2", "3", "4"])).to.be.deep.equal([
                { value: "1", color: "red", label: "Critical" },
                { value: "2", color: "orange", label: "High" },
                { value: "3", color: "yellow", label: "Medium" },
                { value: "4", color: "blue", label: "Low" }]);
        });
        it("returns custom positions of labels when label is placed between semicolons.", function () {
            chai_1.expect(InputParser_1.InputParser.getOptions({
                "FieldName": "Priority",
                "Colors": "red;orange;yellow;blue",
                "Values": "1;2;3;4",
                "Labels": "Critical;;;Low"
            }, ["1", "2", "3", "4"])).to.be.deep.equal([
                { value: "1", color: "red", label: "Critical" },
                { value: "2", color: "orange", label: "" },
                { value: "3", color: "yellow", label: "" },
                { value: "4", color: "blue", label: "Low" }]);
        });
        it("returns custom positions of colors when no color is placed between semicolons.", function () {
            chai_1.expect(InputParser_1.InputParser.getOptions({
                "FieldName": "Priority",
                "Colors": "red;;yellow;blue",
                "Values": "1;2;3;4",
                "Labels": "Critical;High;Medium;Low"
            }, ["1", "2", "3", "4"])).to.be.deep.equal([
                { value: "1", color: "red", label: "Critical" },
                { value: "2", color: "", label: "High" },
                { value: "3", color: "yellow", label: "Medium" },
                { value: "4", color: "blue", label: "Low" }]);
        });
        it("Returns one option when one value,one label, and one are color provided", function () {
            chai_1.expect(InputParser_1.InputParser.getOptions({
                "FieldName": "Priority",
                "Colors": "red",
                "Values": "1",
                "Labels": "Critical"
            }, ["1"])).to.be.deep.equal([
                { value: "1", color: "red", label: "Critical" },
            ]);
        });
    });
});
