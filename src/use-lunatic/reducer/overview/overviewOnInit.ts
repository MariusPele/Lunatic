import type { LunaticOverviewItem } from '../../type';
import type {
	ComponentLoopType,
	ComponentType,
	ComponentTypeBase,
	LunaticSource,
} from '../../type-source';

/**
 * Resolve overview items from component definition
 */
function overviewFromComponent(
	items: LunaticOverviewItem[],
	component: ComponentType,
	extra: Partial<LunaticOverviewItem> = {}
): LunaticOverviewItem[] {
	// For loop we need to explore Subsequence inside the loop
	if (component.componentType === 'Loop') {
		return overviewFromLoop(items, component);
	}

	// Only consider Sequence / Subsequence as potential overview item
	if (
		component.componentType === 'Subsequence' ||
		component.componentType === 'Sequence'
	) {
		const page = component.page ?? component.goToPage;
		const parts = page.split('.');
		items.push({
			id: component.id,
			type: component.componentType,
			pageTag: page,
			page: parseInt(parts[0], 10),
			label: component.label,
			description: component.description,
			conditionFilter: component.conditionFilter,
			...extra,
		});
	}

	return items;
}

/**
 * Resolve subcomponents of a loop
 */
function overviewFromLoop(
	items: LunaticOverviewItem[],
	component: ComponentTypeBase & ComponentLoopType
): LunaticOverviewItem[] {
	// Since we don't know how many iterations we have, skip this component
	if (!('iterations' in component)) {
		return items;
	}
	for (const child of component.components) {
		items = overviewFromComponent(items, child, {
			iterations: component.iterations.value,
		});
	}
	return items;
}

/**
 * Build a static overview from the state, this overview will be interpreted on page change
 */
export function buildOverview(source: LunaticSource): LunaticOverviewItem[] {
	return source.components.reduce(
		(acc, c) => overviewFromComponent(acc, c),
		[] as LunaticOverviewItem[]
	);
}
