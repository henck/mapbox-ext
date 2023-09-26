import * as React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { DefaultSkin, ISkin } from '../../types/Skin';

interface IProps {
  /** @ignore */
  className?: string;
  /** @ignore */
  children?: React.ReactNode;
  /** Hint horizontal offset from center of parent, in pixels. */
  offset: number;
  /** Should Hint appear to left or right of parent? */
  side: 'left' | 'right';
  /** Is parent control disabled? */
  disabled?: boolean;
  /** Optional skin to apply. */
  skin?: ISkin;
  /** Enable wobble effect? */
  wobble?: boolean;
}

const NewHintBase = (props: IProps) => {
  return (
    <div className={props.className}>
      <div className="small-circle"></div>
      <div className="big-circle"></div>
      <div className="box">
        {props.children}
      </div>
    </div>
  )
}

const NewHintStyled = styled(NewHintBase)`
  /* Position */
  position: absolute;
  ${p => p.side == "left"  && css`left:  calc(100% + ${p.offset}px);`};
  ${p => p.side == "right" && css`right: calc(100% + ${p.offset}px);`};
  top: 0;

  .small-circle {
    position: absolute;
    box-sizing: border-box;
    top: calc(50% - 4px);
    left: 0;
    width: 10px;
    height: 10px;
    border: solid 2px white;
    background: #333;
    border-radius: 10px;
  }

  .big-circle {
    position: absolute;
    box-sizing: border-box;
    top: calc(50% - 7px);
    left: 20px;
    width: 14px;
    height: 14px;
    border: solid 2px white;
    background: #333;
    border-radius: 14px;    
  }
`

const NewHint = (props: IProps) => <NewHintStyled {...props}/>

export { NewHint }