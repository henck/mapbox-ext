/**
 * An `IPoint` is an object that has `lat` and `lng` properties. This interface
 * is used as the Mapbox LngLat is an object with methods.
 */
export interface IPoint { 
  lat: number;
  lng: number;
}

/**
 * A PointCollection is a list of points.
 */
export type PointCollection = IPoint[];
