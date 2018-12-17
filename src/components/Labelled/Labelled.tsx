import * as React from 'react';
import {classNames} from '@shopify/react-utilities/styles';

import {Action, Error} from '../../types';

import {withAppProvider, WithAppProviderProps} from '../AppProvider';
import {buttonFrom} from '../Button';
import Label, {Props as LabelProps, labelID} from '../Label';
import InlineError from '../InlineError';

import * as styles from './Labelled.scss';

export {Action, labelID};

export interface Props {
  /** A unique identifier for the label */
  id: LabelProps['id'];
  /** Text for the label */
  label: string;
  /** Error to display beneath the label */
  error?: Error | boolean;
  /** An action */
  action?: Action;
  /** Additional hint text to display */
  helpText?: React.ReactNode;
  /** Content to display inside the connected */
  children?: React.ReactNode;
  /** Visually hide the label */
  labelHidden?: boolean;
  /** Displays the number of characters entered in the input */
  characterCount?: number;
  /** Maximum character length for an input */
  inputMaxLength?: number;
}

export type CombinedProps = Props & WithAppProviderProps;

function Labelled({
  id,
  label,
  error,
  action,
  helpText,
  children,
  labelHidden,
  characterCount,
  inputMaxLength,
  polaris: {intl},
  ...rest
}: CombinedProps) {
  const className = classNames(labelHidden && styles.hidden);

  const actionMarkup = action ? buttonFrom(action, {plain: true}) : null;

  const helpTextMarkup = helpText ? (
    <div className={styles.HelpText} id={helpTextID(id)}>
      {helpText}
    </div>
  ) : null;

  const errorMarkup = error &&
    typeof error !== 'boolean' && (
      <div className={styles.Error}>
        <InlineError message={error} fieldID={id} />
      </div>
    );

  const labelMarkup = label ? (
    <div className={styles.LabelWrapper}>
      <Label id={id} {...rest} hidden={false}>
        {label}
      </Label>
      {actionMarkup}
    </div>
  ) : null;

  const characterCountText = intl.translate(
    inputMaxLength
      ? 'Polaris.Labelled.characterCountWithMaxLength'
      : 'Polaris.Labelled.characterCount',
    {characterCount, inputMaxLength},
  );
  const characterCountMarkup = characterCount !== undefined && (
    <span
      id={`${id}-labeled-character-counter`}
      className={styles.CharacterCount}
      aria-live="polite"
      aria-atomic="true"
    >
      {characterCountText}
    </span>
  );

  const labelCharacterCountMarkup = (
    <div className={styles.LabelCharacterCountWrapper}>
      {labelMarkup}
      {characterCountMarkup}
    </div>
  );

  return (
    <div className={className}>
      {labelCharacterCountMarkup}
      {children}
      {errorMarkup}
      {helpTextMarkup}
    </div>
  );
}

export function errorID(id: string) {
  return `${id}Error`;
}

export function helpTextID(id: string) {
  return `${id}HelpText`;
}

export default withAppProvider<Props>()(Labelled);
