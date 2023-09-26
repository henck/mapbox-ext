import * as React from 'react';
import styled from 'styled-components';

interface IPopupBodyProps {
  className?: string;
  children?: React.ReactNode;
}

const PopupBodyBase = (props: IPopupBodyProps) => {
  return (
    <div className={props.className}>
      {props.children}
    </div>
  );
}

const PopupBodyStyled = styled(PopupBodyBase)`
  width: 200px;
  height: 200px;
  background: #333;
  color: #fff;
  border: solid 2px #ddd;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 2px 2px 2px rgb(0,0,0,0.5);
`

const PopupBody = (props: IPopupBodyProps) => <PopupBodyStyled {...props}/>

export { PopupBody }

