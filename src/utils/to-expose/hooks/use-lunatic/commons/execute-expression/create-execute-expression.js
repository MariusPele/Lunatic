import executeExpression from './execute-expression';
import getExpressionVariables from './get-expressions-variables';
import createMemoizer from './create-memoizer';
import createRefreshCalculated from './create-refresh-calculated';

function getVtlCompatibleValue(value) {
	if (value === undefined) {
		return null;
	}
	if (Array.isArray(value)) {
		return {
			dataStructure: { result: {} },
			dataPoints: {
				result: value,
			},
		};
	}

	return value;
}

function createBindings(variables) {
	return Object.entries(variables).reduce(function (
		bindings,
		[name, { value }]
	) {
		return { ...bindings, [name]: value };
	},
	{});
}

/**
 *
 * @param {*} variables
 * @returns
 */
function createExecuteExpression(variables, features) {
	// on aimerait map d'expression, avec les bindings
	const bindings = createBindings(variables);
	const tokensMap = new Map();
	const collectedUpdated = new Map();
	const [memoize, getMemoizedValue] = createMemoizer();
	const [refreshCalculated, setToRefreshCalculated] = createRefreshCalculated({
		variables,
		execute,
		bindings,
	});

	/**
	 *
	 * @param {*} name
	 * @param {*} value
	 */
	function updateBindings(name, value) {
		// update des bindings
		if (name in bindings) {
			bindings[name] = value;
			collectedUpdated.set(name, []);
		}
		// enrichissement des variables à rafraîchir
		const { CalculatedLinked = [] } = variables[name];

		CalculatedLinked.forEach(function (variable) {
			const { name } = variable;
			setToRefreshCalculated(name, variable);
		});
	}

	function getVariablesAndCach(expression) {
		if (tokensMap.has(expression)) {
			return tokensMap.get(expression);
		}
		const tokens = getExpressionVariables(expression, variables);
		tokensMap.set(expression, tokens);
		return tokens;
	}

	/**/
	function collecteVariables(dependencies) {
		if (Array.isArray(dependencies)) {
			return dependencies.reduce(function (map, name) {
				if (name in variables) {
					const data = variables[name];
					const { variable, type } = data;
					if (!(name in map)) {
						if (type === 'CALCULATED') {
							const { expression } = variable;
							const subDependencies = getVariablesAndCach(expression);

							return {
								...map,
								[name]: { ...variable },
								...collecteVariables(subDependencies),
							};
						}

						return { ...map, [name]: { ...variable } };
					}
				} else {
					throw new Error(`Unknow variable ${name}`);
				}
				return map;
			}, {});
		}
		return {};
	}

	function resolveUseContext(name, { iteration }) {
		const value = bindings[name];
		if (iteration !== undefined && Array.isArray(value)) {
			if (iteration < value.length) {
				return value[iteration];
			}
			return null;
		}
		return getVtlCompatibleValue(value);
	}

	function fillVariablesValues(map, { iteration }) {
		return Object.entries(map).reduce(function (sub, [name, _]) {
			return {
				...sub,
				[name]: resolveUseContext(name, { iteration }),
			};
		}, {});
	}

	/*	*/

	function execute(expression, args) {
		const { iteration, logging } = args;
		const bindingDependencies = getVariablesAndCach(expression);

		function loggingDefault(_, bindings, e) {
			if (process.env.NODE_ENV === 'development') {
				console.warn(`VTL error :  ${expression}`, { ...args }, { bindings });
				console.warn(e);
			}
		}

		const vtlBindings = refreshCalculated(
			fillVariablesValues(collecteVariables(bindingDependencies), {
				iteration,
			}),
			{ rootExpression: expression, iteration }
		);

		const memoized = getMemoizedValue(expression, vtlBindings);
		if (!memoized) {
			const result = executeExpression(
				vtlBindings,
				expression,
				features,
				logging || loggingDefault
			);
			memoize(expression, vtlBindings, result);

			return result;
		}
		return memoized;
	}

	return [execute, updateBindings];
}

export default createExecuteExpression;
