import { type Action, ActionKind } from '../actions';
import type { LunaticReducerState } from '../type';
import { reduceGoNextPage } from './reduce-go-next-page';
import { reduceHandleChange } from './reduce-handle-change';
import { reduceGoPreviousPage } from './reduce-go-previous-page';
import { reduceGoToPage } from './reduce-go-to-page';

export function reducer(
	state: LunaticReducerState,
	action: Action
): LunaticReducerState {
	switch (action.type) {
		case ActionKind.GO_PREVIOUS_PAGE:
			return reduceGoPreviousPage(state);
		case ActionKind.GO_NEXT_PAGE:
			return reduceGoNextPage(state);
		case ActionKind.GO_TO_PAGE:
			return reduceGoToPage(state, action);
		case ActionKind.HANDLE_CHANGE:
			return reduceHandleChange(state, action);
		default:
			return state;
	}
}
