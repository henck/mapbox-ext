import * as React from 'react';
import styled from 'styled-components';

interface ILegendBoxProps {
  /** @ignore */
  className?: string;
  /** Legend box color, e.g. "green" or "#0f0" */
  color: string;
}

/**
 * A small, colored square box.
 */
class LegendBoxBase extends React.Component<ILegendBoxProps> {
  render = () => {
    const p = this.props;
    return (
      <div className={p.className}></div>
    );
  }
}

const LegendBoxStyled = styled(LegendBoxBase)`
  width:  10px;
  height: 10px;
  border: solid 1px black;
  border-radius: 2px;
  background-color: ${p => p.color};
  transition: border-color ease-in-out 150ms;
  &:hover {
    border-color: solid 1px white;
  }
`

const LegendBox = (p: ILegendBoxProps) => <LegendBoxStyled {...p}/>

export { LegendBox, ILegendBoxProps }
