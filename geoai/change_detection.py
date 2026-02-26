"""
GeoAI — Simple change detection example
Requires: rasterio, numpy, geopandas

Usage:
  python geoai/change_detection.py before.tif after.tif output_changes.geojson

This script compares two aligned single-band rasters and exports detected
change areas as polygons (GeoJSON).
"""
import sys
import numpy as np
import rasterio
from rasterio import features
import json


def detect_change(path_before, path_after, out_geojson, threshold=30):
    with rasterio.open(path_before) as src1, rasterio.open(path_after) as src2:
        arr1 = src1.read(1).astype('float32')
        arr2 = src2.read(1).astype('float32')

        # Simple difference and threshold
        diff = np.abs(arr2 - arr1)
        change_mask = (diff >= threshold).astype('uint8')

        # Vectorize mask
        transform = src1.transform
        shapes = features.shapes(change_mask, transform=transform)

        features_list = []
        for geom, val in shapes:
            if val == 1:
                features_list.append({
                    'type': 'Feature',
                    'properties': {'detected': 1},
                    'geometry': geom
                })

        feature_collection = {'type': 'FeatureCollection', 'features': features_list}

        with open(out_geojson, 'w', encoding='utf-8') as fh:
            json.dump(feature_collection, fh)

    print(f"Wrote {len(features_list)} change features to {out_geojson}")


if __name__ == '__main__':
    if len(sys.argv) < 4:
        print('Usage: change_detection.py before.tif after.tif out.geojson')
        sys.exit(1)
    detect_change(sys.argv[1], sys.argv[2], sys.argv[3])
