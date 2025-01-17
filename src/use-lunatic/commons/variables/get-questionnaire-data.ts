import type { LunaticVariablesStore } from './lunatic-variables-store';
import type { LunaticData, LunaticSource } from '../../type';

export function getQuestionnaireData(
	store: LunaticVariablesStore,
	variables: LunaticSource['variables'],
	withCalculated: boolean = false,
	variableNames?: string[]
): LunaticData {
	const result = {
		EXTERNAL: {} as Record<string, unknown>,
		CALCULATED: {} as Record<string, unknown>,
		COLLECTED: {} as Record<
			string,
			{
				EDITED: unknown;
				FORCED: unknown;
				INPUTTED: unknown;
				PREVIOUS: unknown;
				COLLECTED: unknown;
			}
		>,
	};

	if (!variables) {
		return result;
	}

	// Only return requested variables
	if (variableNames) {
		return {
			...result,
			COLLECTED: Object.fromEntries(
				variableNames.map((name) => [
					name,
					{
						EDITED: null,
						FORCED: null,
						INPUTTED: null,
						PREVIOUS: null,
						COLLECTED: store.get(name),
					},
				])
			),
		};
	}

	for (const variable of variables) {
		// Skip calculated value if necessary
		if (variable.variableType === 'CALCULATED' && !withCalculated) {
			continue;
		}

		if (variable.variableType === 'COLLECTED') {
			result.COLLECTED[variable.name] = {
				PREVIOUS: null,
				FORCED: null,
				EDITED: null,
				INPUTTED: null,
				...variable.values,
				COLLECTED: store.get(variable.name),
			};
		} else {
			try {
				result[variable.variableType][variable.name] = store.get(variable.name);
			} catch {
				// Error can happen when calculating variable, send null to prevent crashing the mehod
				result[variable.variableType][variable.name] = null;
			}
		}
	}
	return result;
}
