import React from 'react';
import createCustomizableLunaticField from '../../create-customizable-field';

function Th({ id, index, children }) {
	return (
		<th id={`lunatic-table-th-${id}-${index}`} className="lunatic-table-th">
			{children}
		</th>
	);
}

export default createCustomizableLunaticField(Th);
