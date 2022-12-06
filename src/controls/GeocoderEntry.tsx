import * as React from 'react';
import { css } from 'styled-components';
import styled from 'styled-components';

import { IGeocoderFeature } from './GeocoderApi';

interface IProps {
  /** @ignore */
  className?: string;
  /** Feature to show in this entry. */
  feature: IGeocoderFeature;
  /** Fired when entry is clicked. */
  onClick: () => void;
  /** Is entry currently keyboard-selected? */
  selected?: boolean;
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

const GeocoderEntry = styled(GeocoderEntryBase)`
  box-sizing: border-box;
  cursor: pointer;
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: #fff;
  transition: background-color ease-in-out 150ms;
  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  ${p => p.selected && css`background-color: #ddd;`}
  ${p => !p.selected && css`&:nth-child(2n+1) {
    background-color: #f4f4f4;
  }`}
  &:hover {
    background-color: #ddd;
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
