import * as React from 'react';
import styled, { css } from 'styled-components';

import { GeocoderApi, IGeocoderFeature } from './GeocoderApi';
import { GeocoderEntry } from './GeocoderEntry';
import { GeocoderList } from './GeocoderList';
import { GeocoderInput } from './GeocoderInput';
import { useMap } from 'react-map-gl';

const DEFAULT_BORDER_RADIUS = 8;

interface IProps {
  /** @ignore */
  className?: string;
  /** Horizontal button position. A negative value is an offset from the right. */
  x: number;
  /** Vertical button position. A negative value is an offset from the bottom. */
  y: number;  
  /** Border radius in pixels. Defaults to 8. */
  borderRadius?: number;
  /** Show a static search icon? */
  searchIcon?: boolean;
  /** Add clear button? */
  clearable?: boolean;  
  /** Mapbox access token. */
  access_token: string;
}

const GeocoderBase = (props: IProps) => {
  const wrapperRef = React.useRef(null);
  const { current: map } = useMap();

  // Timer is used for debouncing requests:
  const [timer, setTimer] = React.useState(null);
  // Current query:
  const [q, setQ] = React.useState("");
  // Currently retrieved features:
  const [features, setFeatures] = React.useState([]);
  // Offset of currently-selected feature (0-based):
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  //
  // Clear the control, removing any items.
  // Focus on input.
  //  
  const clear = () => {
    setQ("");
    setFeatures([]);
    setSelectedIndex(0);
    if (wrapperRef) wrapperRef.current.querySelector('input').focus();    
  }

  //
  // Call mapbox geocoder API, and store results in state.
  //
  const lookup = (q: string) => {
    if(q == "") return;
    GeocoderApi.lookup("mapbox.places", q, props.access_token)
    .then(res => {
      setFeatures(res.features);
    });
  }  

  // 
  // Debounce calls to lookup by 350ms.
  // 
  const lookupDebounced = (q: string) => {
    if(timer != null) {
      window.clearTimeout(timer)
      setTimer(null);
    }
    setTimer(window.setTimeout(() => lookup(q), 350));
  }

  //
  // Handle document-wide mousedown event by closing the list.
  //
  const handleClickOutside = () => {
    let elem:Element = event.target as Element;
    if (wrapperRef && !wrapperRef.current.contains(elem)) {
      clear();
    }
  };  

  const handleChange = (newq: string) => {
    // When clearing, we want immediate result:
    if(newq == "") {
      clear();
      return;
    }
    // Non-clearing needs a debounce.
    setQ(newq);
    lookupDebounced(newq);
  }

  const handleClick = (feature: IGeocoderFeature) => {
    if(feature.bbox) {
      map.fitBounds(feature.bbox);
    } else {
      map.flyTo({
        center: { lng: feature.center[0] , lat: feature.center[1] }
      });
    }
    clear();
  }  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch(e.code) {
      case 'ArrowDown':
      case 'Numpad2':
        e.preventDefault();
        setSelectedIndex(Math.min(selectedIndex + 1, features.length - 1 ));
        break;
      case 'ArrowUp':
      case 'Numpad8':
        e.preventDefault();
        setSelectedIndex(Math.max(selectedIndex - 1, 0 ));
        break;
      case 'Enter':
        e.preventDefault();
        handleClick(features[selectedIndex]);
        break;
      case 'Escape':
        e.preventDefault();
        clear();
        break;
    }
  }    

  React.useEffect(() => {
    // Listen for document-wide mousedown event when control mounts.
    document.addEventListener('mousedown', handleClickOutside);
    // Clean up document-wide mousedown event when control unmounts.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <div className={props.className} onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e)} ref={wrapperRef}>
      {props.y >= 0 && <GeocoderInput searchIcon={props.searchIcon} clearable={props.clearable} value={q} onChange={handleChange} onClear={clear}/>}
      <GeocoderList>
        {features.map((f, idx) => 
          <GeocoderEntry key={idx} feature={f} selected={idx == selectedIndex} onClick={() => handleClick(f)}/>)}
      </GeocoderList>
      {props.y < 0 && <GeocoderInput searchIcon={props.searchIcon} clearable={props.clearable} value={q} onChange={handleChange} onClear={clear}/>}
    </div>);
}

const Geocoder = styled(GeocoderBase)`
  /* Location */
  position: absolute;
  ${p => p.x >= 0 && css`left: ${p.x}px;`}
  ${p => p.x < 0 && css`right: ${-p.x}px;`}
  ${p => p.y >= 0 && css`top: ${p.y}px;`}
  ${p => p.y < 0 && css`bottom: ${-p.y}px;`}
  z-index: 9999;

  /* Size */
  width: 300px;

  /* Content */
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Appearance */
  background: #fff;
  border-radius: ${p => p.borderRadius ?? DEFAULT_BORDER_RADIUS}px;
  border: solid 2px #333333;
  box-shadow: 1px 1px 2px rgb(0,0,0,0.5);
`

export { Geocoder } 
