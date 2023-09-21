import { COLLECTED, VTL } from '../utils/constants';
import type { LunaticState } from './type';
import { SuggesterStatus } from './use-suggesters';
import { LunaticVariablesStore } from './commons/lunatic-variables-store';

const INITIAL_STATE: LunaticState = {
	variables: {}, // map des variables du questionnaires
	dataStore: new LunaticVariablesStore(),
	pages: {},
	isInLoop: false,
	isFirstPage: false,
	isLastPage: false,
	features: [VTL],
	preferences: [COLLECTED],
	savingType: COLLECTED,
	cleaning: {},
	missingBlock: {},
	resizing: {},
	overview: [],
	pager: {
		page: '1',
		maxPage: '1',
		subPage: undefined,
		nbSubPages: undefined,
		iteration: undefined,
		shallowIteration: undefined,
		nbIterations: undefined,
	},
	waiting: false,
	/* fonctionnalités vtl & md */
	updateBindings: () => {},
	executeExpression: (() => {}) as LunaticState['executeExpression'],
	handleChange: () => {},
	goToPage: () => undefined,
	goNextPage: () => {},
	goPreviousPage: () => {},
	activeControls: false,
	getSuggesterStatus: (name: string) => ({
		status: SuggesterStatus.unused,
		timestamp: 0,
	}),
};

export default INITIAL_STATE;
