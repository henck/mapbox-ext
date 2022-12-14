/** @module @ignore */
import * as React from 'react';
import styled from 'styled-components';
import { createRoot } from 'react-dom/client';
import { MapView } from './MapView';

interface IProps {
  className?: string;
}

class AppBase extends React.Component<IProps> {
  render = () => {
    const p = this.props;
    return (
      <div className={p.className}><MapView/></div>
    );
  }
}

const App = styled(AppBase)`
  width: 100vw;
  height: 100vh;
`

const root = createRoot(document.getElementById('root'));
root.render(<App/>);

// Whenever webpack rebuilds the project, refresh the browser.
declare let module: any;
if (module.hot) {
  module.hot.accept(); 
}