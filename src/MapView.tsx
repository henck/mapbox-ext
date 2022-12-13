import * as React from 'react';

import Map, { Layer, LngLat, LngLatBoundsLike, MapLayerMouseEvent, Source, ViewState, ViewStateChangeEvent } from 'react-map-gl';
import { ZoomInButton } from './controls/ZoomInButton';
import { ZoomOutButton } from './controls/ZoomOutButton';
import { CompassButton } from './controls/CompassButton';
import { AnimatedLoader } from './controls/AnimatedLoader';
import { ScaleControl } from './controls/ScaleControl';
import { Geocoder } from './controls/Geocoder';
import { DarkSkin } from './types/Skin';
import { Graticule } from './controls/Graticule';
import { Debug } from './controls/Debug';
import { Rose } from './controls/Rose';
import { PolygonEditor } from './controls/PolygonEditor/PolygonEditor';
import { MapButton } from './controls/MapButton';
import { PolygonBuilder } from './controls/PolygonEditor/PolygonBuilder';
import { PointCollection } from './types/Types';

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

interface ICage {
  points: PointCollection
}

interface IState {
  // MapView keeps track of map's ViewState, which can be used to pass state
  // to map controls.
  viewState: ViewState;

  interactiveLayerIds: string[];

  cages: ICage[];
  selectedCage: number;
  isAdding: boolean;
}

class MapView extends React.Component<{}, IState> {
  state: IState = {
    viewState: {
      longitude: 34.39412, 
      latitude: -0.36795, 
      zoom: 8,
      bearing: 0,
      pitch: 0,
      padding: { top: 0, bottom: 0, right: 0, left: 0 }
    },

    interactiveLayerIds: [],
    cages: [],
    selectedCage: null,
    isAdding: false
  };

  handleLoad = (e: mapboxgl.MapboxEvent) => {
    this.setState({
      interactiveLayerIds: [ 'polys' ]
    });
  }  

  handleMove = (e: ViewStateChangeEvent) => {
    this.setState({
      viewState: e.viewState
    });
  }

  handleClick = (e: MapLayerMouseEvent) => {
    if(e.features.length == 0) return;
    const feature = e.features[0];
    if(feature.layer.id != 'polys') return;
    this.setState({
      selectedCage: feature.id as number
    });
  }

  handleBeginAddCage = () => {
    this.setState({ isAdding: true, selectedCage: null });
  }

  handleCancelAddCage = () => {
    this.setState({ isAdding: false });
  }

  handleDoAddCage = (points: PointCollection) => {
    const cage = { points: points };
    this.setState({ 
      isAdding: false,
      cages: [...this.state.cages, cage ]
    });
  }

  handleCancelEditCage = () => {
    this.setState({
      selectedCage: null
    });
  }

  handleEditCage = (points: PointCollection) => {
    this.state.cages[this.state.selectedCage].points = points;
    this.setState({
      cages: this.state.cages
    });
  }

  handleDeleteCage = () => {
    this.state.cages.splice(this.state.selectedCage, 1);
    this.setState({
      selectedCage: null,
      cages: this.state.cages
    });
  }

  render = () => {
    return (
      <Map
        {...this.state.viewState}
        mapboxAccessToken={ACCESS_TOKEN}
        style={{width: '100%', height: '100%'}}
        cursor={'auto'}
        logoPosition="bottom-left"
        interactiveLayerIds={this.state.interactiveLayerIds}
        mapStyle={GREY_STYLE}
        //maxBounds={MAX_BOUNDS}
        //minZoom={8}
        maxZoom={22}
        onLoad={this.handleLoad}
        onMove={this.handleMove}
        onClick={this.handleClick}
      >
        <Geocoder access_token={ACCESS_TOKEN} x={-200} y={40} searchIcon clearable/>
        <Geocoder skin={DarkSkin} access_token={ACCESS_TOKEN} x={-520} y={40} searchIcon clearable/>

        <ScaleControl {...this.state.viewState} width={200} x={10} y={-62}/>
        <ZoomInButton  {...this.state.viewState} attachedBottom x={40} y={40} hint={<>Zoom in</>}/>
        <ZoomOutButton {...this.state.viewState} attachedTop attachedBottom x={40} y={40+34} hint={<>Zoom out</>}/>
        <CompassButton {...this.state.viewState} attachedTop x={40} y={40+34*2} hint={<>Reset bearing to north</>} visualizePitch/>

        <ZoomInButton active {...this.state.viewState} x={40} y={200} hint={<>Zoom in</>}/>
        <ZoomOutButton disabled {...this.state.viewState} x={40} y={250} hint={<>Zoom out</>}/>
        <CompassButton {...this.state.viewState} x={40} y={300} hint={<>Reset bearing to north</>} visualizePitch/>

        <ZoomInButton skin={DarkSkin} active {...this.state.viewState} x={40} y={400} hint={<>Zoom in</>}/>
        <ZoomOutButton skin={DarkSkin} disabled {...this.state.viewState} x={40} y={450} hint={<>Zoom out</>}/>
        <CompassButton skin={DarkSkin} {...this.state.viewState} x={40} y={500} hint={<>Reset bearing to north</>} visualizePitch/>

        <AnimatedLoader x={-100} y={-100} active/>

        <Graticule decimal adaptive labels degrees={90} {...this.state.viewState}/>
        <Debug {...this.state.viewState} x={-40} y={-40}/>

        <Rose {...this.state.viewState} x={-20} y={20} visualizePitch/>

        <MapButton skin={DarkSkin} active={this.state.isAdding} x={40} y={-200} onClick={this.handleBeginAddCage}>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 87 87">
          <path d="M24.4,2.3c-3.6,0-6.4,2.9-6.4,6.4c0,3.6,2.9,6.4,6.4,6.4c3.6,0,6.4-2.9,6.4-6.4C30.8,5.2,27.9,2.3,24.4,2.3
              z M24.4,12.4c-2,0-3.6-1.6-3.6-3.6c0-2,1.6-3.6,3.6-3.6c2,0,3.6,1.6,3.6,3.6C28,10.7,26.4,12.4,24.4,12.4z"/>
            <path d="M63.9,9.9c-3.6,0-6.4,2.9-6.4,6.4s2.9,6.4,6.4,6.4c3.6,0,6.4-2.9,6.4-6.4S67.5,9.9,63.9,9.9z M63.9,20
              c-2,0-3.6-1.6-3.6-3.6s1.6-3.6,3.6-3.6c2,0,3.6,1.6,3.6,3.6S65.9,20,63.9,20z"/>
            <path d="M79.2,59.8c-3.6,0-6.4,2.9-6.4,6.4c0,3.6,2.9,6.4,6.4,6.4s6.4-2.9,6.4-6.4C85.6,62.7,82.7,59.8,79.2,59.8z
              M79.2,69.9c-2,0-3.6-1.6-3.6-3.6c0-2,1.6-3.6,3.6-3.6s3.6,1.6,3.6,3.6C82.8,68.3,81.2,69.9,79.2,69.9z"/>
            <path d="M39,72.7c-3.6,0-6.4,2.9-6.4,6.4c0,3.6,2.9,6.4,6.4,6.4c3.6,0,6.4-2.9,6.4-6.4C45.5,75.6,42.6,72.7,39,72.7
              z M39,82.8c-2,0-3.6-1.6-3.6-3.6s1.6-3.6,3.6-3.6s3.6,1.6,3.6,3.6S41,82.8,39,82.8z"/>
            <path d="M9.1,45.7c-3.6,0-6.4,2.9-6.4,6.4s2.9,6.4,6.4,6.4c3.6,0,6.4-2.9,6.4-6.4S12.7,45.7,9.1,45.7z M9.1,55.8
              c-2,0-3.6-1.6-3.6-3.6s1.6-3.6,3.6-3.6s3.6,1.6,3.6,3.6S11.1,55.8,9.1,55.8z"/>
            <path d="M60.9,41.9v4.5c0,0.6-0.2,1.2-0.7,1.6c-0.4,0.4-1,0.7-1.6,0.7h-9.7v9.7
              c0,0.6-0.2,1.2-0.7,1.6c-0.4,0.4-1,0.7-1.6,0.7h-4.5c-0.6,0-1.2-0.2-1.6-0.7c-0.4-0.4-0.7-1-0.7-1.6v-9.7h-9.7
              c-0.6,0-1.2-0.2-1.6-0.7c-0.4-0.4-0.7-1-0.7-1.6v-4.5c0-0.6,0.2-1.2,0.7-1.6c0.4-0.4,1-0.7,1.6-0.7h9.7v-9.7c0-0.6,0.2-1.2,0.7-1.6
              c0.4-0.4,1-0.7,1.6-0.7h4.5c0.6,0,1.2,0.2,1.6,0.7c0.4,0.4,0.7,1,0.7,1.6v9.7h9.7c0.6,0,1.2,0.2,1.6,0.7
              C60.7,40.7,60.9,41.3,60.9,41.9z"/>
            <rect x="14.7" y="12.5" transform="matrix(0.9455 0.3257 -0.3257 0.9455 10.7421 -3.7892)"  width="4" height="35.3"/>
            <rect x="8.6"  y="64"   transform="matrix(0.7229 0.6909 -0.6909 0.7229 52.1121 2.0746)"   width="29.7" height="4"/>
            <rect x="56.9" y="56.7" transform="matrix(0.2803 0.9599 -0.9599 0.2803 112.2371 -4.1819)" width="4" height="32.1"/>
            <rect x="50.6" y="39.6" transform="matrix(0.2903 0.9569 -0.9569 0.2903 90.653 -39.1022)"  width="42.2" height="4"/>
            <rect x="28.4" y="11.1" transform="matrix(0.9906 0.1366 -0.1366 0.9906 2.1981 -5.8497)"   width="30.6" height="4"/>
          </svg>
        </MapButton>

        <Source generateId type="geojson" data={{
          type: 'FeatureCollection',
          features: this.state.cages
                    .filter((cage, idx) => idx != this.state.selectedCage)
                    .map((cage, idx) => { return { 
              id: idx,
              type: 'Feature',
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: [[...cage.points.map(p => [ p.lng, p.lat]), [cage.points[0].lng, cage.points[0].lat]]]
              }
            }
          })
        }}>
          <Layer 
            id="polys" 
            type="fill"
            paint={{
              'fill-color': 'darkgreen',
              'fill-opacity': 0.5
            }}
            />
          <Layer 
            type="line"
            paint={{
              'line-color': 'black',
              'line-width': 1
            }}
            />
        </Source>

        {this.state.selectedCage !== null && 
          <PolygonEditor 
            points={this.state.cages[this.state.selectedCage].points}
            onChange={this.handleEditCage}
            onCancel={this.handleCancelEditCage}
            onDelete={this.handleDeleteCage}
          />}

        {this.state.isAdding && <PolygonBuilder
          onCancel={this.handleCancelAddCage}
          onComplete={this.handleDoAddCage}
        />}
      </Map>
    );
  }
}

export { MapView }
