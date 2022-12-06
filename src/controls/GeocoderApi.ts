import { LngLatBoundsLike } from 'mapbox-gl';
import { Results } from '@mapbox/mapbox-gl-geocoder';

interface IGeocoderFeature {
  bbox: LngLatBoundsLike;
  center: number[];
  place_name: string;
  place_type: string[];
  relevance: number;
  text: string;
}

interface IGeocoderResponse {
  type: string;
  query: string[],
  features: IGeocoderFeature[],
  attribution: string;
}

class GeocoderApi {
  static async lookup(endpoint: string, search: string, mapkey: string): Promise<Results> {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/${endpoint}/${search}.json?access_token=${mapkey}`, {
      method: 'GET',
    });
    return response.json();
  }
}

export { GeocoderApi, IGeocoderResponse, IGeocoderFeature }
