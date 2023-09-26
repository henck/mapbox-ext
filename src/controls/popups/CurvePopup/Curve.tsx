import * as React from 'react';

const PADDING = 50;
const AMIMATION_INTERVAL = 100; // milliseconds

interface ICurvePositionProps {
  /** Start point, X-coordinate. */
  x1: number;
  /** Start point, Y-coordinate. */
  y1: number;
  /** End point, X-coordinate. */
  x2: number;
  /** End point, Y-coordinate. */
  y2: number;
}

interface ICurveAppearanceProps {
  /** Line color; defaults to white. */
  color?: string;
  /** Spline weighting. Value between 0.0 and 1.0, where 0.5 is a balanced spline. Defaults to 0.5. */
  factor?: number;
  /** Should there be an arrowhead at the end of the curve? */
  arrow?: boolean;
  /** Line thickness: defaults to 2. */
  thickness?: number;
  /** Is the curve dashed? */
  dashed?: boolean;
  /** Size of arrow, in pixels. Defaults to 10. */
  arrowSize?: number;
  /** Is the curve animated? Only works with dashed curves. */
  animated?: boolean;
}

/** 
 * An illustrative `Curve` is a curved line from `(x1,y1)` to `(x2,y2)`, in 
 * parent coordinates.  
 */
const Curve = React.memo((props: ICurvePositionProps & ICurveAppearanceProps) => {
  // Curve uses React.memo so that it only rerenders when its props change,
  // not when the parent's props change.
  const [dashOffset, setDashOffset] = React.useState(0);

  const mount = (): number => {
    if(!props.animated) return 0;
    return window.setInterval(() => {
      setDashOffset(x => (x + 1) % 10);
    }, AMIMATION_INTERVAL);
  }

  const unmount = (intervalID: number) => {
    if(!props.animated) return;
    window.clearInterval(intervalID);
  }

  React.useEffect(() => {
    const intervalID = mount();
    return () => unmount(intervalID);
  }, []);

  // Set default values:
  const _color = props.color ?? "white";
  const _thickness = props.thickness ?? 2;
  const _factor = props.factor ?? 0.5;        
  const _arrowSize = props.arrowSize ?? 10;

  // Render:
  const { x1, y1, x2, y2 } = props;
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);
  return (
    <div style={{pointerEvents: "none", position: "absolute", left: (Math.min(x1,x2)) + "px", top: (Math.min(y1,y2)) + "px", width: width + "px", height: height + "px", transform: `scaleX(${x2 < x1 ? -1 : 1}) scaleY(${y2 < y1 ? -1 : 1})`}}>
      {/* curve SVG */}
      <svg 
        version="1.1" xmlns="http://www.w3.org/2000/svg"
        viewBox={`-${PADDING} -${PADDING} ${width+PADDING*2} ${height+PADDING*2}`}
        width={width + PADDING*2}
        height={height + PADDING*2}
        stroke={_color}
        style={{position: "absolute", left: -PADDING + "px", top: -PADDING + "px", boxSizing: 'border-box'}}>
          <path d={`M 0 0 Q ${width*_factor} 0, ${width/2} ${height/2} Q ${width*(1-_factor)} ${height}, ${width} ${height}`} 
                fill="none" strokeDasharray={props.dashed ? "5 5" : "none"} strokeDashoffset={dashOffset} strokeWidth={_thickness} vectorEffect="non-scaling-stroke"/>
      </svg>
      {/* Arrow SVG */}
      {props.arrow && 
        <svg
          version="1.1" xmlns="http://www.w3.org/2000/svg"
          viewBox={`-${PADDING} -${PADDING} ${_arrowSize+PADDING*2} ${_arrowSize+PADDING*2}`}
          width={_arrowSize + PADDING*2}
          height={_arrowSize + PADDING*2}
          stroke="none"
          fill={_color}
          style={{position: "absolute", left: (width-PADDING) + "px", top: (height-PADDING-_arrowSize/2) + "px"}}>
            <path d={`M 0 0 L ${_arrowSize} ${_arrowSize/2} L 0 ${_arrowSize} Z`}/>
        </svg>}
    </div>
  )
});


export { Curve, ICurvePositionProps, ICurveAppearanceProps }
