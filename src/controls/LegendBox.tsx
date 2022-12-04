import * as React from 'react';
import styled from 'styled-components';

interface IProps {
  className?: string;
  color: string;
}

/**
 * A small, colored square box.
 */
class LegendBoxBase extends React.Component<IProps> {
  render = () => {
    const p = this.props;
    return (
      <div className={p.className}></div>
    );
  }
}

const LegendBox = styled(LegendBoxBase)`
  width: 10px;
  height: 10px;
  border: solid 1px black;
  border-radius: 2px;
  background-color: ${p => p.color};
  transition: border-color ease-in-out 150ms;
  &:hover {
    border-color: solid 1px white;
  }
`

export { LegendBox }
