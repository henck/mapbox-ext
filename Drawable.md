# Drawables

* Drawables can be shown using a Layer. CSS would flicker too much, and require
  many lat/lng to screen conversions.

* A Drawable must be able to turn a feature into edit mode. A feature is always
  a polygon. Lines and points are not initially supported.

* A Drawable shows the polygon being edited as dotted lines and draggable 
  points. Clicking a point makes it active, allowing keyboard control. Dragging
  a point moves it. Clicking DEL removes a point. Double-clicking a line
  adds a point.

* A Polygon cannot be saved if it consists of less than 3 points. 

* FINS cages can be circular, rectangular, or polygons.
  A cicular cage has a different edit mode than a polygon. This means that
  each cage has a type: "circular" or "polygon".