/** @hidden */
import * as React from 'react';
import styled from 'styled-components';

interface IProps {
  /** @ignore */
  className?: string;
  /** @ignore */
  children?: React.ReactNode;
}

/**
 * Animated list of fixed-height items.
 */
class GeocoderListBase extends React.Component<IProps> {
  render = () => {
    const p = this.props;
    return <div className={p.className}>{p.children}</div>;
  }
}

/** @hidden */
const GeocoderList = styled(GeocoderListBase)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: height ease-in-out 150ms;
  height: ${p => React.Children.count(p.children) * 52}px;
`

export { GeocoderList }
