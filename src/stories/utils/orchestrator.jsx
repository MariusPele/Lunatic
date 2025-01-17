import './custom-lunatic.scss';
import './orchestrator.scss';

import {
	Button,
	components,
	LunaticComponents,
	ModalControls,
	useLunatic,
} from '../..';
import React, { memo, useCallback, useEffect, useState } from 'react';

import { Logger } from '../../utils/logger';
import { Overview } from './overview';
import { SchemaValidator } from './SchemaValidator.jsx';

const Input = components.Input;

function DevOptions({ goToPage, getData }) {
	const [toPage, setToPage] = useState(1);

	function handleChange(_, value) {
		setToPage(value);
	}

	return (
		<div className="dev-options">
			<div style={{ display: 'flex' }}>
				<Button onClick={() => Logger.log(getData(true))}>Get Data</Button>
				<Button onClick={() => goToPage({ page: `${toPage}` })}>
					{`Go to "${toPage}"`}
				</Button>
			</div>
			<Input
				id="page-to-jump"
				value={toPage}
				handleChange={handleChange}
				min={1}
				label={'Page to reach : '}
			/>
		</div>
	);
}

function Pager({
	goPrevious,
	goNext,
	goToPage,
	lastReachedPage,
	isLast,
	isFirst,
	pageTag,
	maxPage,
	getData,
	pager,
}) {
	return (
		<>
			<div className="pagination">
				<Button onClick={goPrevious} disabled={isFirst}>
					Previous
				</Button>
				<Button onClick={goNext} disabled={isLast}>
					Next
				</Button>
				<div style={{ fontSize: '.8em', opacity: 0.7, marginTop: '.3em' }}>
					You can use PgDown / PgUp shortcut
				</div>
			</div>
			<DevOptions
				goToPage={goToPage}
				getData={getData}
				lastReachedPage={lastReachedPage}
			/>
			<div className="story-pager">
				<h3>Pager</h3>
				<ul>
					<li>
						<strong>PageTag:</strong> {JSON.stringify(pageTag)}
					</li>
					{Object.keys(pager).map((key) => (
						<li key={key}>
							<strong>{key}:</strong> {JSON.stringify(pager[key])}
						</li>
					))}
				</ul>
			</div>
		</>
	);
}

function onLogChange(response, value, args) {
	Logger.log('onChange', { response, value, args });
}

function logMissingStrategy() {
	Logger.log('no missing strategy');
}

function OrchestratorForStories({
	source,
	data,
	management = false,
	shortcut = false,
	activeControls = false,
	features,
	initialPage = '1',
	missing = false,
	missingStrategy = logMissingStrategy,
	missingShortcut,
	autoSuggesterLoading,
	addExternal,
	preferences,
	slots,
	showOverview = false,
	filterDescription = true,
	getReferentiel,
	dontKnowButton,
	refusedButton,
	readOnly = false,
	disabled = false,
	...rest
}) {
	const { maxPage } = source;
	const {
		getComponents,
		goPreviousPage,
		goNextPage,
		goToPage,
		pager,
		pageTag,
		isFirstPage,
		isLastPage,
		waiting,
		overview,
		compileControls,
		getData,
		Provider,
		hasPageResponse,
	} = useLunatic(source, data, {
		initialPage,
		features,
		preferences,
		onChange: onLogChange,
		autoSuggesterLoading,
		getReferentiel,
		management,
		missing,
		missingStrategy,
		lastReachedPage: rest.lastReachedPage,
		missingShortcut,
		shortcut,
		activeControls,
		withOverview: showOverview,
		dontKnowButton,
		refusedButton,
	});

	const components = getComponents();
	const { lastReachedPage } = pager;

	const [errorActive, setErrorActive] = useState({});
	const [errorsForModal, setErrorsForModal] = useState(null);

	const skip = useCallback(
		(arg) => {
			setErrorsForModal(undefined);
			goNextPage(arg);
		},
		[goNextPage]
	);

	const closeModal = useCallback(() => setErrorsForModal(undefined), []);

	const handleGoNext = useCallback(() => {
		const { currentErrors, isCritical } = compileControls();
		setErrorActive({ ...errorActive, [pageTag]: currentErrors || {} });
		if (currentErrors && Object.keys(currentErrors).length > 0) {
			setErrorsForModal({ currentErrors, isCritical });
		} else goNextPage();
	}, [compileControls, errorActive, goNextPage, pageTag]);

	// Allow PageDown / PageUp shortcut to ease navigation
	useEffect(() => {
		const listener = (e) => {
			let stopPropagation = false;
			if (e.key === 'PageDown') {
				handleGoNext();
				stopPropagation = true;
			}
			if (e.key === 'PageUp') {
				goPreviousPage();
				stopPropagation = true;
			}
			if (stopPropagation) {
				e.preventDefault();
				e.stopPropagation();
			}
		};
		document.addEventListener('keydown', listener);
		return () => {
			document.removeEventListener('keydown', listener);
		};
	}, [handleGoNext, goPreviousPage]);

	return (
		<Provider>
			<div className="container story-with-sidebar">
				<div className="components">
					<LunaticComponents
						slots={slots}
						autoFocusKey={pageTag}
						components={components}
						componentProps={() => ({
							errors: errorActive[pageTag],
							filterDescription: filterDescription,
							disabled: disabled,
							readOnly: readOnly,
						})}
					/>
					<SchemaValidator source={source} />
				</div>
				<aside>
					<Pager
						goPrevious={goPreviousPage}
						goNext={handleGoNext}
						goToPage={goToPage}
						lastReachedPage={lastReachedPage}
						isLast={isLastPage}
						isFirst={isFirstPage}
						pageTag={pageTag}
						maxPage={maxPage}
						getData={getData}
						pager={pager}
					/>
					<div className="story-pager">
						<h3>Misc</h3>
						<ul>
							<li>
								<strong>pageHasResponse:</strong>{' '}
								{JSON.stringify(hasPageResponse())}
							</li>
						</ul>
					</div>
					{showOverview && <Overview overview={overview} goToPage={goToPage} />}
					{errorsForModal && (
						<ModalControls
							errors={errorsForModal.currentErrors}
							goNext={skip}
							onClose={closeModal}
							isCritical={errorsForModal.isCritical}
						/>
					)}
				</aside>
			</div>
		</Provider>
	);
}

export default memo(OrchestratorForStories);
