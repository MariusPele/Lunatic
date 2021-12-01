import * as actions from '../actions';
import reduceGoNext from './reduce-go-next';
import reduceOnInit from './reduce-on-init';

function reducer(state, action) {
	const { type } = action;
	switch (type) {
		case actions.GO_NEXT:
			return reduceGoNext(state, action);
		case actions.ON_INIT:
			return reduceOnInit(state, action);
		default:
			return state;
	}
}

export default reducer;
