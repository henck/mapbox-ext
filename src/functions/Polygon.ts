import { IPoint } from "../types/Types";

const TO_RAD = Math.PI / 180;
const EARTH_RADIUS = 6378137;   // Radius of earth in meters

/**
 * The Polygon class provides some simple geometric analysis tools.
 */
class Polygon {
  static toRadians = (degrees: number) => TO_RAD * degrees;

  static distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    var dLat = lat2 * TO_RAD - lat1 * TO_RAD;
    var dLon = lon2 * TO_RAD - lon1 * TO_RAD;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * TO_RAD) * Math.cos(lat2 * TO_RAD) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = EARTH_RADIUS * c;
    return d; // meters
  }

  static addMeters = (lng: number, lat: number, dx: number, dy: number) => {
    return {
      lng: lng + (dx / EARTH_RADIUS) * (180 / Math.PI) / Math.cos(lat * TO_RAD),
      lat: lat + (dy / EARTH_RADIUS) * (180 / Math.PI)
    }
  }

  private static turn = (p1: IPoint, p2: IPoint, p3: IPoint) => {
    const a = p1.lng; const b = p1.lat; 
    const c = p2.lng; const d = p2.lat;
    const e = p3.lng; const f = p3.lat;
    const A = (f - b) * (c - a);
    const B = (d - b) * (e - a);
    return (A > B + Number.EPSILON) ? 1 : (A + Number.EPSILON < B) ? -1 : 0;
  }
  
  private static getLine(points: IPoint[], index: number): IPoint[] {
    const p1 = points[index];
    const p2 = index >= points.length - 1 ? points[0] : points[index+1];
    return [p1, p2];
  }

  /**
   * Does the line (p1,p2) intersect with line (p3,p4)?
   * 
   * @returns `true` if the lines intersect, `false` if not.
   */
  static isIntersect = (p1: IPoint, p2: IPoint, p3: IPoint, p4: IPoint) => {
    return (Polygon.turn(p1, p3, p4) != Polygon.turn(p2, p3, p4)) && (Polygon.turn(p1, p2, p3) != Polygon.turn(p1, p2, p4));
  }  

  /**
   * Is the polygon specified by the list of points valid, i.e it does _not_
   * self-intersect?
   * 
   * @param points Polygon points. Do not duplicate the last point.
   * @returns `true` if the polygon is valid (does not self-intersect),
   * `false` if not.
   */
  static isValid = (points: IPoint[]) => {
    // For each edge:
    for(let i = 0; i < points.length; i++) {
      const [p1, p2] = Polygon.getLine(points, i);
      // Find non-connected edges:
      for(let j = 0; j < points.length - 3; j++) {
        let s = i + j + 2;
        if(s >= points.length) s -= points.length;
        const [p3, p4] = Polygon.getLine(points, s);
        // Check for intersection:
        if(Polygon.isIntersect(p1,p2,p3,p4)) return false;
      }
    }
    return true;
  }
}

export { Polygon }
