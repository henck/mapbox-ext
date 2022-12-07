import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';

import Map, { Layer, LngLatBoundsLike, MapboxGeoJSONFeature, MapboxMap, MapLayerMouseEvent, Popup, Source, ViewState, ViewStateChangeEvent } from 'react-map-gl';
import { ZoomInButton } from './controls/ZoomInButton';
import { ZoomOutButton } from './controls/ZoomOutButton';
import { CompassButton } from './controls/CompassButton';
import { AnimatedLoader } from './controls/AnimatedLoader';
import { ScaleControl } from './controls/ScaleControl';
import { Geocoder } from './controls/Geocoder';
import { DarkSkin } from './controls/Skin';

const ACCESS_TOKEN = "pk.eyJ1IjoibG9uZ2xpbmVlbnZpcm9ubWVudCIsImEiOiJjbGF0cHF1ZWUwM2l0M3FwcDcyN3B1YXpmIn0.snFi9yTPEZ5lfQxE3h3Epg";
const GREY_STYLE = "mapbox://styles/longlineenvironment/clatpsjsl003r15okdwsdclmi";
const SATELLITE_STYLE = "mapbox://styles/longlineenvironment/clb14ar2y00hw14oh9ii2zp05";
          
//
// Bounds that map panning and zooming will be restricted to.
//
const MAX_BOUNDS: LngLatBoundsLike = [
  [31.62658, -2.36805],    // Southwest (lng/lat)
  [37.75470,  1.77630]     // Northeast (lng/lat)
];

interface IState {
  // MapView keeps track of map's ViewState, which can be used to pass state
  // to map controls.
  viewState: ViewState;

  loading: boolean;
  satellite: boolean;
  interactiveLayerIds: string[];

  hoverLatitude: number;
  hoverLongitude: number;
  hoverFeatures: MapboxGeoJSONFeature[];
  popup_horizontal: 'left' | 'right';
  popup_vertical: 'top' | 'bottom';
}

class MapView extends React.Component<{}, IState> {
  private loadCount: number = 0;
  private hovered: MapboxGeoJSONFeature[] = [];

  state: IState = {
    viewState: {
      longitude: 34.39412, 
      latitude: -0.36795, 
      zoom: 8,
      bearing: 0,
      pitch: 0,
      padding: { top: 0, bottom: 0, right: 0, left: 0 }
    },

    loading: false,
    satellite: false,
    interactiveLayerIds: [],

    hoverLatitude: 0,
    hoverLongitude: 0,
    hoverFeatures: [],
    popup_horizontal: 'left',
    popup_vertical: 'top',
  };

  handleLoad = (e: mapboxgl.MapboxEvent) => {
    this.setState({
      interactiveLayerIds: [
        'County boundaries', 'Inshore aquaculture', 'Offshore aquaculture', 
        'Inshore socioeconomic suitability', 'Offshore socioeconomic suitability',
        'Tilapia suitability', 'Management areas',
        'Beach management units', 'Sub-basins', 'Sampling stations' ]
    });
  }  

  addLoader = () => {  
    this.loadCount++;
    this.setState({ loading: true });
  }

  removeLoader = () => {
    this.loadCount--;
    this.setState({ loading: this.loadCount > 0 });
  }

  handleMove = (e: ViewStateChangeEvent) => {
    this.setState({
      viewState: e.viewState
    });
  }

  render = () => {
    return (
      <Map
        {...this.state.viewState}
        mapboxAccessToken={ACCESS_TOKEN}
        style={{width: '100%', height: '100%'}}
        cursor={this.state.hoverFeatures.length > 0 ? 'pointer' : 'auto'}
        logoPosition="bottom-left"
        interactiveLayerIds={this.state.interactiveLayerIds}
        mapStyle={this.state.satellite ? SATELLITE_STYLE : GREY_STYLE}
        //maxBounds={MAX_BOUNDS}
        //minZoom={8}
        maxZoom={22}
        onLoad={this.handleLoad}
        onMove={this.handleMove}
      >
        <Geocoder access_token={ACCESS_TOKEN} x={-40} y={40} searchIcon clearable/>
        <Geocoder skin={DarkSkin} access_token={ACCESS_TOKEN} x={-360} y={40} searchIcon clearable/>

        <ScaleControl {...this.state.viewState} width={200} x={10} y={-62}/>
        <ZoomInButton  {...this.state.viewState} attachedBottom x={40} y={40} hint={<>Zoom in</>}/>
        <ZoomOutButton {...this.state.viewState} attachedTop attachedBottom x={40} y={40+34} hint={<>Zoom out</>}/>
        <CompassButton {...this.state.viewState} attachedTop x={40} y={40+34*2} hint={<>Reset bearing to north</>} visualizePitch/>

        <ZoomInButton active {...this.state.viewState} x={40} y={200} hint={<>Zoom in</>}/>
        <ZoomOutButton disabled {...this.state.viewState} x={40} y={250} hint={<>Zoom out</>}/>
        <CompassButton {...this.state.viewState} x={40} y={300} hint={<>Reset bearing to north</>} visualizePitch contrastTip/>

        <ZoomInButton skin={DarkSkin} active {...this.state.viewState} x={40} y={400} hint={<>Zoom in</>}/>
        <ZoomOutButton skin={DarkSkin} disabled {...this.state.viewState} x={40} y={450} hint={<>Zoom out</>}/>
        <CompassButton skin={DarkSkin} {...this.state.viewState} x={40} y={500} hint={<>Reset bearing to north</>} visualizePitch contrastTip/>

        <AnimatedLoader x={-100} y={-100} active/>
      </Map>
    );
  }
}

export { MapView }
