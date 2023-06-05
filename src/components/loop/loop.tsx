import React from 'react';
import BlockForLoop from './block-for-loop';
import RosterForLoop from './roster-for-loop';
import SummaryLoop from './summary-loop';
import { LunaticComponentProps } from '../type';

const LoopTypes = {
	rosterForLoop: 'RosterForLoop',
	blockForLoop: 'Loop',
  summaryLoop: 'SummaryLoop',
};

function Loop(props: LunaticComponentProps<'Loop' | 'RosterForLoop' | 'SummaryLoop'>) {
	const {
		declarations,
		label,
		lines,
		iterations,
		id,
		components,
		handleChange,
		value,
		executeExpression,
		componentType,
		headers,
		shortcut,
		management,
		missing,
		features,
		preferences,
		paginatedLoop,
		errors,
	} = props;
  console.log(props)
	switch (componentType) {
		case LoopTypes.blockForLoop:
			return (
				<BlockForLoop
					declarations={declarations}
					label={label}
					lines={lines}
					iterations={iterations}
					id={id}
					components={components}
					handleChange={handleChange}
					value={value}
					management={management}
					executeExpression={executeExpression}
					missing={missing}
					shortcut={shortcut}
					features={features}
					preferences={preferences}
					paginatedLoop={paginatedLoop}
					errors={errors}
				/>
			);
		case LoopTypes.rosterForLoop:
			return (
				<RosterForLoop
					declarations={declarations}
					label={label}
					lines={lines}
					iterations={iterations}
					id={id}
					components={components}
					handleChange={handleChange}
					value={value}
					management={management}
					executeExpression={executeExpression}
					missing={missing}
					shortcut={shortcut}
					features={features}
					preferences={preferences}
					headers={headers}
					errors={errors}
				/>
			);
      case LoopTypes.summaryLoop:
        return (
          <SummaryLoop
            declarations={declarations}
            label={label}
            lines={lines}
            iterations={iterations}
            id={id}
            components={components}
            handleChange={handleChange}
            value={value}
            management={management}
            executeExpression={executeExpression}
            missing={missing}
            shortcut={shortcut}
            features={features}
            preferences={preferences}
            errors={errors}
          />
        );
		default:
			return null;
	}
}

export default Loop;
