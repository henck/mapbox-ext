/**
 * Common settings for Polygon and Circle editors.
 */

// Polygon builder/editor share a few layers that must have known IDs:
export const POLYGON_LAYER   = 'drawable-polygon';
export const POINTS_LAYER    = 'drawable-points';
export const EXTENDERS_LAYER = 'drawable-extenders';
export const SCALER_LAYER    = 'drawable-scaler';

// Editor colors:
export const POLYGON_FILL_COLOR_VALID    = "orange";
export const POLYGON_FILL_COLOR_INVALID  = "red";
export const POLYGON_LINE_COLOR_VALID    = "orange";
export const POLYGON_LINE_COLOR_INVALID  = "red";
export const POLYGON_CIRCLE_COLOR        = "orange";
export const POLYGON_CIRCLE_STROKE_COLOR = "white";
export const POLYGON_SCALER_COLOR        = "white";

// Number of points used to visualize a circle:
export const NUM_CIRCLE_POINTS = 36;