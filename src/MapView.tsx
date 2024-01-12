/** @module @ignore */
import * as React from 'react';
import Map, { LngLatBoundsLike, MapboxGeoJSONFeature, MapboxMap, MapLayerMouseEvent, ViewState, ViewStateChangeEvent } from 'react-map-gl';

import { ZoomInButton } from './controls/buttons/ZoomInButton';
import { ZoomOutButton } from './controls/buttons/ZoomOutButton';
import { CompassButton } from './controls/buttons/CompassButton';
import { AnimatedLoader } from './controls/AnimatedLoader';
import { ScaleControl } from './controls/ScaleControl';
import { Geocoder } from './controls/Geocoder';
import { DarkSkin } from './types/Skin';
import { Graticule } from './controls/Graticule';
import { Debug } from './controls/Debug';
import { Rose } from './controls/Rose';
import { MapButton } from './controls/buttons/MapButton';
import { PolygonBuilder, PolygonEditor } from './editors/PolygonEditor';
import { CircleBuilder, CircleEditor } from './editors/CirleEditor';
import { IPoint, PointCollection } from './types/Types';
import { CagesSource } from './CagesSource';
import { Legend } from './controls/Legend';
import { LegendBox } from './controls/Legend/LegendBox';
import { CurvePopup } from './controls/popups/CurvePopup/CurvePopup';
import { PopupBody } from './controls/popups/CurvePopup/PopupBody';
import { FullscreenButton } from './controls/buttons/FullscreenButton';

const ACCESS_TOKEN = "pk.eyJ1IjoibG9uZ2xpbmVlbnZpcm9ubWVudCIsImEiOiJjbGF0cHF1ZWUwM2l0M3FwcDcyN3B1YXpmIn0.snFi9yTPEZ5lfQxE3h3Epg";
const GREY_STYLE = "mapbox://styles/longlineenvironment/clatpsjsl003r15okdwsdclmi";
const SATELLITE_STYLE = "mapbox://styles/longlineenvironment/clb14ar2y00hw14oh9ii2zp05";
const NUM_CAGES = 5000;

//
// Bounds that map panning and zooming will be restricted to.
//
const MAX_BOUNDS: LngLatBoundsLike = [
  [31.62658, -2.36805],    // Southwest (lng/lat)
  [37.75470,  1.77630]     // Northeast (lng/lat)
];

export interface ICage {
  type: 'circle' | 'polygon';
  points?: PointCollection
  point?: IPoint;
  radius?: number;
}

interface IState {
  // MapView keeps track of map's ViewState, which can be used to pass state
  // to map controls.
  viewState: ViewState;

  mouseLongitude: number;
  mouseLatitude: number;
  hover: boolean;

  interactiveLayerIds: string[];

  cages: ICage[];
  selectedCage: ICage;
  add?: 'circle' | 'polygon';
}

class MapView extends React.Component<{}, IState> {
  private map: MapboxMap = null;
  private hovered: MapboxGeoJSONFeature = null;

  generateCages = () => {
    const cages = [];
    for(let i = 0; i < NUM_CAGES; i++) {
      const cage: ICage = {
        type: 'circle',
        point: { lng: Math.random() * 10 - 5 + 34.0, lat: Math.random() * 10 - 5 + 0 },
        radius: Math.random() * 5000 + 1000
      }
      cages.push(cage);
    }
    return cages;
  }

  state: IState = {
    viewState: {
      longitude: 34.39412, 
      latitude: -0.36795, 
      zoom: 8,
      bearing: 0,
      pitch: 0,
      padding: { top: 0, bottom: 0, right: 0, left: 0 }
    },

    mouseLongitude: 0,
    mouseLatitude: 0,
    hover: false,

    interactiveLayerIds: [],
    cages: this.generateCages(),
    selectedCage: null,
    add: null
  };

  handleLoad = (e: mapboxgl.MapboxEvent) => {
    this.map = e.target;
    this.setState({
      interactiveLayerIds: [ 'cages' ]
    });
  }  

  handleMove = (e: ViewStateChangeEvent) => {
    this.setState({
      viewState: e.viewState
    });
  }

  handleMouseMove = (e: MapLayerMouseEvent) => {
    this.setState({ hover: false });
    if(!e.features) return;

    if(this.hovered) {
      this.map.setFeatureState(this.hovered, { hover: false });
    }

    const features = e.features.filter(f => f.layer.id == "cages");
    if(features.length == 0) return;

    this.hovered = features[0];
    this.map.setFeatureState(this.hovered, { hover: true });

    this.setState({
      hover: true,
      mouseLongitude: e.lngLat.lng,
      mouseLatitude:  e.lngLat.lat
    });
  }


  handleClick = (e: MapLayerMouseEvent) => {
    if(e.features.length == 0) return;
    const feature = e.features[0];
    if(feature.layer.id != 'cages') return;
    this.setState({
      selectedCage: this.state.cages[feature.id as number]
    });
  }

  handleBeginAddCage = (type: 'polygon' | 'circle') => {
    this.setState({ add: type, selectedCage: null });
  }

  handleCancelAddCage = () => {
    this.setState({ add: null });
  }

  handleDoAddPolygonCage = (points: PointCollection) => {
    const cage: ICage = { type: 'polygon', points: points };
    this.setState({ 
      add: null,
      cages: [...this.state.cages, cage ]
    });
  }

  handleDoAddCircleCage = (point: IPoint, radius: number) => {
    const cage: ICage = { type: 'circle', point: point, radius: radius };
    this.setState({ 
      add: null,
      cages: [...this.state.cages, cage ]
    });    
  }

  handleCancelEditCage = () => {
    this.setState({
      selectedCage: null
    });
  }

  handleEditPolygonCage = (points: PointCollection) => {
    this.state.selectedCage.points = points;
    this.setState({
      cages: this.state.cages
    });
  }

  handleEditCircleCage = (point: IPoint, radius: number) => {
    this.state.selectedCage.point = point;
    this.state.selectedCage.radius = radius;
    this.setState({
      cages: this.state.cages
    });    
  }

  handleDeleteCage = () => {
    this.state.cages.splice(this.state.cages.indexOf(this.state.selectedCage), 1);
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
        
        logoPosition="bottom-left"
        interactiveLayerIds={this.state.interactiveLayerIds}
        mapStyle={GREY_STYLE}
        //maxBounds={MAX_BOUNDS}
        //minZoom={8}
        maxZoom={22}
        onLoad={this.handleLoad}
        onMove={this.handleMove}
        onClick={this.handleClick}
        onMouseMove={this.handleMouseMove}
      >
        <CagesSource cages={this.state.cages} selectedCage={this.state.selectedCage}/>

        <Geocoder {...this.state.viewState} access_token={ACCESS_TOKEN} x={-200} y={40} searchIcon clearable/>
        <Geocoder {...this.state.viewState} skin={DarkSkin} access_token={ACCESS_TOKEN} x={-520} y={40} searchIcon clearable/>

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
        <FullscreenButton skin={DarkSkin} {...this.state.viewState} x={40} y={550} hint={<>Toggle full screen</>}/>

        <AnimatedLoader {...this.state.viewState} x={-100} y={-100} active/>

        {/*<Graticule adaptive labels degrees={90} {...this.state.viewState}/>*/}
        {/* <Debug {...this.state.viewState} x={-40} y={-40}/> */}

        <Rose {...this.state.viewState} x={-20} y={20} visualizePitch/>

        <Legend {...this.state.viewState} x={-100} y={-120}>
          <LegendBox color="green" label="long line of text"/>
          <LegendBox color="red" label="long line of text"/>
        </Legend>

        <MapButton skin={DarkSkin} active={this.state.add == 'polygon'} x={40} y={-200} onClick={() => this.handleBeginAddCage('polygon')}>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100">
            <path d="M90.6,100H9.4C4.2,100,0,95.8,0,90.6V9.4C0,4.2,4.2,0,9.4,0h81.3c5.2,0,9.4,4.2,9.4,9.4v81.3
              C100,95.8,95.8,100,90.6,100z M9.4,8C8.6,8,8,8.6,8,9.4v81.3C8,91.4,8.6,92,9.4,92h81.3c0.8,0,1.4-0.6,1.4-1.4V9.4
              C92,8.6,91.4,8,90.6,8H9.4z"/>
            <path d="M78.6,43.8v8.4c0,1.2-0.4,2.1-1.2,3c-0.8,0.8-1.8,1.2-3,1.2H56.3v18.1
              c0,1.2-0.4,2.1-1.2,3s-1.8,1.2-3,1.2h-8.4c-1.2,0-2.1-0.4-3-1.2c-0.8-0.8-1.2-1.8-1.2-3V56.3H21.5c-1.2,0-2.1-0.4-3-1.2
              c-0.8-0.8-1.2-1.8-1.2-3v-8.4c0-1.2,0.4-2.1,1.2-3c0.8-0.8,1.8-1.2,3-1.2h18.1V21.5c0-1.2,0.4-2.1,1.2-3c0.8-0.8,1.8-1.2,3-1.2h8.4
              c1.2,0,2.1,0.4,3,1.2s1.2,1.8,1.2,3v18.1h18.1c1.2,0,2.1,0.4,3,1.2C78.2,41.7,78.6,42.6,78.6,43.8z"/>
          </svg>
        </MapButton>

        <MapButton skin={DarkSkin} active={this.state.add == 'circle'} x={40} y={-150} onClick={() => this.handleBeginAddCage('circle')}>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100">
            <path d="M50,100C22.4,100,0,77.6,0,50S22.4,0,50,0s50,22.4,50,50S77.6,100,50,100z M50,8C26.8,8,8,26.8,8,50
              c0,23.2,18.8,42,42,42c23.2,0,42-18.8,42-42C92,26.8,73.2,8,50,8z"/>
            <path d="M80.6,45.8v8.4c0,1.2-0.4,2.1-1.2,3c-0.8,0.8-1.8,1.2-3,1.2H58.3v18.1
              c0,1.2-0.4,2.1-1.2,3s-1.8,1.2-3,1.2h-8.4c-1.2,0-2.1-0.4-3-1.2c-0.8-0.8-1.2-1.8-1.2-3V58.3H23.5c-1.2,0-2.1-0.4-3-1.2
              c-0.8-0.8-1.2-1.8-1.2-3v-8.4c0-1.2,0.4-2.1,1.2-3c0.8-0.8,1.8-1.2,3-1.2h18.1V23.5c0-1.2,0.4-2.1,1.2-3c0.8-0.8,1.8-1.2,3-1.2h8.4
              c1.2,0,2.1,0.4,3,1.2s1.2,1.8,1.2,3v18.1h18.1c1.2,0,2.1,0.4,3,1.2C80.2,43.7,80.6,44.6,80.6,45.8z"/>
          </svg>
        </MapButton>        

        <CurvePopup latitude={this.state.mouseLatitude} longitude={this.state.mouseLongitude} visible={this.state.hover} curve={{color: "gold", animated: true, arrow: true, arrowSize: 12, dashed: true}}>
          <PopupBody>
            Hello.
          </PopupBody>
        </CurvePopup>

        {this.state.selectedCage !== null && this.state.selectedCage.type == 'polygon' && 
          <PolygonEditor 
            points={this.state.selectedCage.points}
            onChange={this.handleEditPolygonCage}
            onCancel={this.handleCancelEditCage}
            onDelete={this.handleDeleteCage}
            allowScaling
          />}

         {this.state.selectedCage !== null && this.state.selectedCage.type == 'circle' && 
          <CircleEditor 
            point={this.state.selectedCage.point}
            radius={this.state.selectedCage.radius}
            onChange={this.handleEditCircleCage}
            onCancel={this.handleCancelEditCage}
            onDelete={this.handleDeleteCage}
          />}

        {this.state.add == 'polygon' && <PolygonBuilder
          onCancel={this.handleCancelAddCage}
          onComplete={this.handleDoAddPolygonCage}
        />}

        {this.state.add == 'circle' && <CircleBuilder
          onCancel={this.handleCancelAddCage}
          onComplete={this.handleDoAddCircleCage}
        />}
      </Map>
    );
  }
}

export { MapView }
