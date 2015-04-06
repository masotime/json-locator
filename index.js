/* global require, module */
'use strict';
var jsonpath = require('jsonpath');

var filterEx = /(\[[^\]]+\])+/g;
var partsEx = /\[([^\]]+)\]/g;
var variableEx = /([a-zA-Z][a-zA-Z0-9]*)/;
var arrayIndexEx = /^(\*|[0-9:,\-]+)$/;

function transform(expression) {
	// this will evolve over time
	var filters = expression.match(filterEx) || [];
	var jsonPathFilters = filters.map(function (expr) {
		var execResult, isArrayIndex, exprParts = [];

		// see http://goo.gl/e79O6E
		while ((execResult = partsEx.exec(expr)) !== null) {
			exprParts.push(execResult[1].trim());
		}

		isArrayIndex = exprParts.filter(function test(part) { return arrayIndexEx.test(part); }).length > 0;

		if (isArrayIndex) {
			return expr;
		} else {
			return '[?(' + exprParts.map(function toDoubleEquals(orig) {
				return orig.replace(variableEx, '@.$1').replace(/={1}/g,'==');
			}).join(' && ') + ')]';
		}
	});

	return filters.reduce(function conversion(result, oldExpr, index) {
		return result.replace(oldExpr, jsonPathFilters[index]);
	}, expression);
}

function query(data, expression) {
	return jsonpath.query(data, transform(expression));
}

module.exports = {
	transform: transform,
	query: query
};