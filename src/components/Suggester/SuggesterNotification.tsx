import React, { type PropsWithChildren, type ReactNode } from 'react';
import { STATUS } from './SuggesterStatus';
import { Notification } from '../shared/Notification';
import { SuggesterStatus } from '../../use-lunatic/use-suggesters';
import { slottableComponent } from '../shared/HOC/slottableComponent';
import { Label } from '../shared/Label/Label';

type Props = PropsWithChildren<{
	status: SuggesterStatus;
	storeName: string;
	label?: ReactNode;
	description?: ReactNode;
}>;

function LunaticSuggesterNotification({
	children,
	status,
	storeName,
	label,
	description,
}: Props) {
	if (status === STATUS.idle || status === STATUS.pending) {
		return (
			<>
				<Label description={description}>{label}</Label>
				<Notification
					className="info"
					title={`Chargement : ${storeName}`}
					description={`Votre référentiel est en cours de chargement. Vous pouvez poursuivre le questionnaire et revenir ultérieurement sur cette question.`}
				/>
			</>
		);
	}
	if (status === STATUS.error) {
		return (
			<>
				<Label description={description}>{label}</Label>
				<Notification
					className="error"
					title={`Échec chargement`}
					description={`Le référentiel ${storeName} n'a pas pu finir son chargement correctement.`}
				/>
			</>
		);
	}
	if (status === STATUS.unknown) {
		return (
			<>
				<Label description={description}>{label}</Label>
				<Notification
					className="warn"
					title={`Référentiel inconnu`}
					description={`Le référentiel ${storeName} n'est pas pris en compte par l'application.`}
				/>
			</>
		);
	}

	return <>{children}</>;
}

export const SuggesterNotification = slottableComponent(
	'SuggesterNotification',
	LunaticSuggesterNotification
);
