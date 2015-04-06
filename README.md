# json-locator

Because all the good names (json-query, json-select, etc) were all taken up, I'm forced to use this name.

Essentially a thin wrapper around the excellent `jsonpath` library. The [JSONPath specification](http://goessner.net/articles/JsonPath/) is sketchy (I mean look at that website, 2007?) and not many people use it, but I needed something that would refer to specific nodes or groups of nodes.

## Usage

	var locator = require('json-locator');
    var data = {
        colors: [
            { type: 'additive', name: 'red', red: 255, green: 0, blue: 0 },
            { type: 'additive', name: 'green', red: 0, green: 255, blue: 0 },
            { type: 'additive', name: 'blue', red: 0, green: 0, blue: 255 },
            { type: 'subtractive', name: 'cyan', red: 0, green: 255, blue: 255 },
            { type: 'subtractive', name: 'magenta', red: 255, green: 0, blue: 255 },
            { type: 'subtractive', name: 'yellow', red: 255, green: 255, blue: 0 },
            { type: 'subtractive', name: 'black', red: 0, green: 0, blue: 0 }
        ]
    };

	locator.transform('colors[type="subtractive"][red<100]'); 
	// expected colors[?(@.type=="subtractive" && @.red<100)]
	
	locator.query(data, 'colors[type="subtractive"][red<100]');
    // expected [ { ... name: 'cyan' ...}, { ... name: 'black' ...} ]

## Motivation

The npm module [jsonpath](https://www.npmjs.com/package/JSONPath) has an excellent implementation and looks well maintained but:

* It evaluates filter expressions using esprima, which means using `==` instead of `=` and boolean operators like `&&`.
* It uses the annoying `@` syntax which is unnecessary 99% of the time.

I wanted to filter something like:

    "inputs": [     
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
        }
    ]
    
with an expression such as

	inputs[type="dropdown"][data.hasPricing].data.options[*].price
	
and get back

	["23", "99"]
	
and not have to use an expression like

	inputs[?(@.type=="dropdown" && @.data.hasPricing)].data.options[*].price

