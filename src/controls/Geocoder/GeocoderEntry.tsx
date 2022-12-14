/** @module @ignore */
import * as React from 'react';
import { css } from 'styled-components';
import styled from 'styled-components';

import { IGeocoderFeature } from './GeocoderApi';
import { DefaultSkin, ISkin } from '../../types/Skin';

interface IProps {
  /** @ignore */
  className?: string;
  /** Feature to show in this entry. */
  feature: IGeocoderFeature;
  /** Fired when entry is clicked. */
  onClick: () => void;
  /** Is entry currently keyboard-selected? */
  selected?: boolean;
  /** Optional skin to apply. */
  skin?: ISkin;
}

class GeocoderEntryBase extends React.Component<IProps> {
  render = () => {
    const p = this.props;
    return (
      <div className={p.className} onClick={p.onClick}>
        <ResultText>{p.feature.text}</ResultText>
        <ResultPlace>{p.feature.place_name}</ResultPlace>
      </div>
    );
  }
}

const GeocoderEntry = styled(GeocoderEntryBase).attrs(p => ({
  skin: p.skin ?? DefaultSkin
}))`
  box-sizing: border-box;
  cursor: pointer;
  padding-top: 6px;
  padding-bottom: 6px;
  color: ${p => p.skin.border};
  background-color: ${p => p.skin.fill};
  transition: background-color ease-in-out 150ms, color ease-in-out 150ms;
  ${p => p.selected && css`
    color: ${p.skin.fill};
    background-color: ${p.skin.border};
  `}
  /* ${p => !p.selected && css`&:nth-child(2n+1) {
    background-color: #f4f4f4;
  }`} */
  &:hover {
    color: ${p => p.skin.fill};
    background-color: ${p => p.skin.border};
  }
`

const ResultText = styled('div')`
  padding-left: 14px;
  padding-right: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
  font-weight: 500;
`

const ResultPlace = styled('div')`
  padding-left: 14px;
  padding-right: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
  font-size: 14px;
`


export { GeocoderEntry }
