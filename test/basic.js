/* global describe, it, require */

var assert = require('assert'),
	locator = require('../index'),
	jsonpath = require('jsonpath');

describe('json-locator', function () {

	describe('canonically', function () {

		var data = {
			'store': {
				'book': [
					{
						'category': 'reference',
						'author': 'Nigel Rees',
						'title': 'Sayings of the Century',
						'price': 8.95
					},
					{
						'category': 'fiction',
						'author': 'Evelyn Waugh',
						'title': 'Sword of Honour',
						'price': 12.99
					},
					{
						'category': 'fiction',
						'author': 'Herman Melville',
						'title': 'Moby Dick',
						'isbn': '0-553-21311-3',
						'price': 8.99
					},
					{
						'category': 'fiction',
						'author': 'J. R. R. Tolkien',
						'title': 'The Lord of the Rings',
						'isbn': '0-395-19395-8',
						'price': 22.99
					}
				], 'bicycle': {
					'color': 'red',
					'price': 19.95
				}
			}
		};

		var expectations = [
			{ given: 'store.book[*].author', expected: 'store.book[*].author' },
			{ given: '$..author', expected: '$..author' },
			{ given: 'store.*', expected: 'store.*' },
			{ given: 'store..price', expected: 'store..price' },
			{ given: '$..book[2]', expected: '$..book[2]' },
			// { given: '..book[length-1]', expected: '..book[(@.length-1)]'}, // do not allow this case
			{ given: '$..book[-1:]', expected: '$..book[-1:]'},
			{ given: '$..book[0,1]', expected: '$..book[0,1]'},
			{ given: '$..book[isbn]', expected: '$..book[?(@.isbn)]'},
			{ given: '$..book[price<10]', expected: '$..book[?(@.price<10)]'},
			{ given: '$..*', expected: '$..*'},
		];

		expectations.forEach(function (expectation) {
			it ('should transform '+expectation.given+' to '+expectation.expected, function() {
				assert.equal(locator.transform(expectation.given), expectation.expected);
				assert(locator.query(data, expectation.given), jsonpath.query(data, expectation.expected));
				console.log(locator.query(data, expectation.given));
			});
		});

	});

	describe('specially', function() {
		var data = {
			"name": "",
			"address": "",
			"password": "",
			"inputs": [
				{
					"type": "textfield",
					"data": {
						"name": "Engraving"
					}
				},
				{
					"type": "textfield",
					"data": {
						"name": "Note to seller"
					}
				},
				{
					"type": "dropdown",
					"data": {
						"name": "Memory",
						"hasPricing": true,
						"hasFrequency": false,
						"options": [
							{
								"name": "one",
								"price": "23",
								"frequency": ""
							},
							{
								"name": "two",
								"price": "99",
								"frequency": ""
							}
						]
					}
				},
				{
					"type": "dropdown",
					"data": {
						"name": "Color",
						"hasPricing": false,
						"hasFrequency": false,
						"options": [
							{
								"name": "one",
							},
							{
								"name": "two",
							}
						]
					}
				}
			]
		};

		var expectations = [
			{ 
				given: 'inputs[type="dropdown"][data.hasPricing].data.options[*].price', 
				expected: 'inputs[?(@.type=="dropdown" && @.data.hasPricing)].data.options[*].price'
			}
		];

		expectations.forEach(function (expectation) {
			it ('should transform '+expectation.given+' to '+expectation.expected, function() {
				assert.equal(locator.transform(expectation.given), expectation.expected);
				assert(locator.query(data, expectation.given), jsonpath.query(data, expectation.expected));
				console.log(locator.query(data, expectation.given));
			});
		});

	});

});