/** @module @ignore */
import * as React from 'react';
import styled from 'styled-components';

import { DefaultSkin, ISkin } from '../../types/Skin';

interface IProps {
  /** @ignore */
  className?: string;
  /** Current value of input. */
  value: string;
  /** Show a static search icon? */
  searchIcon?: boolean;  
  /** Add clear button? */
  clearable?: boolean;
  /** Optional skin to apply. */
  skin?: ISkin;
  /** Optional placeholder. */
  placeholder?: string;
  /** Fired when input value changes. */
  onChange: (q: string) => void;
  /** Fired when clear icon is clicked. */
  onClear: () => void;
}

class GeocoderInputBase extends React.Component<IProps> {
  // 
  // Receive value from ChangeEvent and send it on.
  // 
  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.target.value);
  }

  render = () => {
    const p = this.props;
    return (
      <div className={p.className}>
        <input placeholder={p.placeholder ?? "Type to search places"} value={p.value} onChange={this.handleChange}/>
        {/* Search icon */}
        <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
          <path d="M1216 832q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z"/>
        </svg>
        {/* Clear icon */}
        <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" onClick={p.onClear}>
          <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/>
        </svg>
      </div>
    );
  }
}

const GeocoderInput = styled(GeocoderInputBase).attrs(p => ({
  skin: p.skin ?? DefaultSkin
}))`
  position: relative;
  svg:nth-of-type(1) {
    display: ${p => p.searchIcon ? 'block' : 'none'};
    position: absolute;
    left: 8px;
    top: 7px;
    width: 20px;
    height: 20px;
    fill: ${p => p.skin.disabled};
  }
  svg:nth-of-type(2) {
    display: ${p => p.clearable ? 'block' : 'none'};
    position: absolute;
    right: 8px;
    top: 7px;
    width: 20px;
    height: 20px;
    fill: ${p => p.skin.disabled};
    opacity: ${p => p.value == "" ? 0 : 1};
    transition: opacity ease-in-out 120ms;
    pointer-events: ${p => p.value == "" ? 'none' : 'all'};
    &:hover {
      fill: ${p => p.skin.border};
    }
    cursor: pointer;
  }  
  input {
    width:            100%;
    box-sizing:       border-box;
    z-index:          0;
    line-height:      17px;
    text-align:       left;
    border:           none;
    outline:          0;
    background-color: ${p => p.skin.fill};
    color:            ${p => p.skin.border};
    padding:          9px 14px;
    
    /* Padding for icon, if there is one: */
    padding-left:     ${p => p.searchIcon ? 40 : 14}px;

    /* Padding for clear icon, if present: */
    padding-right:    ${p => p.clearable ? 40 : 14}px;

    /* Define colors for placeholder text. */
    &::placeholder {
      color: ${p => p.skin.disabled};
      opacity: 1 !important; /* Firefox applies opacity */
    }

    /* Define colors for selected text. */
    &::selection {
      background-color: rgba(100,100,100,.4);
      color: ${p => p.theme.fontColor};
    }

    /* Define colors when input has focus. */
    &:focus {
      &::placeholder {
        color: "#444";
      }
    }

    /* Make sure HTML5 validation does not show up. */
    &:valid {
      box-shadow: none;
    }
    &:invalid {
      box-shadow: none;
    }

    /* Turn off number spinners. */
    &[type=number]::-webkit-inner-spin-button, 
    &[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none;  /* Webkit (Chrome) */
      margin: 0; 
    }    
    &[type=number] {
      -moz-appearance:textfield; /* Firefox */
    }
  }
`

export { GeocoderInput }
