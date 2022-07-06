import React, { memo } from 'react';
import * as lunatic from '../../components';
import './custom-lunatic.scss';
import Waiting from './waiting';

function getStoreInfoRequired() {
	return {};
}

function Pager({ goNext, goPrevious, isLast, isFirst, pageTag, maxPage }) {
	if (maxPage && maxPage > 1) {
		const Button = lunatic.Button;
		return (
			<>
				<div className="pagination">
					<Button onClick={goPrevious} disabled={isFirst}>
						Previous
					</Button>
					<Button onClick={goNext} disabled={isLast}>
						Next
					</Button>
				</div>
				<div>PAGE: {pageTag}</div>
			</>
		);
	}
	return null;
}

function onLogChange(response, value, args) {
	console.log('onChange', { response, value, args });
}

function OrchestratorForStories({
	source,
	data,
	management = false,
	modalForControls = false,
	features,
	initialPage = '1',
	getStoreInfo = getStoreInfoRequired,
	missing = false,
	shortcut = false,
	activeGoNextForMissing = false,
	suggesterFetcher,
	autoSuggesterLoading,
	suggesters,
	addExternal,
	preferences,
	custom,
	filterDescription = true,
	...rest
}) {
	const { maxPage } = source;

	const {
		getComponents,
		goNextPage,
		goPreviousPage,
		pageTag,
		isFirstPage,
		isLastPage,
		waiting,
		getErrors,
	} = lunatic.useLunatic(source, data, {
		initialPage,
		features,
		preferences,
		onChange: onLogChange,
		activeGoNextForMissing,
		autoSuggesterLoading,
		suggesters,
		suggesterFetcher,
		management,
		modalForControls,
	});

	const components = getComponents();
	const errors = getErrors();

	return (
		<div className="container">
			<div className="components">
				{components.map(function (component) {
					const { id, componentType, response, storeName, ...other } =
						component;
					const Component = lunatic[componentType];
					const storeInfo = storeName ? getStoreInfo(storeName) : {};

					return (
						<div className="lunatic lunatic-component" key={`component-${id}`}>
							<Component
								id={id}
								response={response}
								{...other}
								{...rest}
								{...component}
								{...storeInfo}
								missing={missing}
								missingStrategy={goNextPage}
								shortcut={shortcut}
								custom={custom}
								filterDescription={filterDescription}
							/>
						</div>
					);
				})}
			</div>
			<Pager
				goNext={goNextPage}
				goPrevious={goPreviousPage}
				isLast={isLastPage}
				isFirst={isFirstPage}
				pageTag={pageTag}
				maxPage={maxPage}
			/>
			<lunatic.Modal
				title="Des points requièrent votre attention."
				errors={errors}
				goNext={goNextPage}
			/>
			<Waiting status={waiting}>
				<div className="waiting-orchestrator">
					Initialisation des données de suggestion...
				</div>
			</Waiting>
		</div>
	);
}

export default memo(OrchestratorForStories);
