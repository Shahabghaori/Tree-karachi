
// ============================================================
// KARACHI TREE CANOPY MAP — GEOTIFF EXPORT
// Meta / WRI Global Canopy Height
// ============================================================

// 1. Study area
var studyArea = ee.FeatureCollection(
  'projects/integrated-hawk-464808-m4/assets/Karachi'
);

var boundary = studyArea.geometry();

// 2. Load canopy-height dataset
var canopyCollection = ee.ImageCollection(
  'projects/sat-io/open-datasets/facebook/meta-canopy-height'
).filterBounds(boundary);

// 3. Create canopy-height mosaic
var canopyHeight = canopyCollection
  .mosaic()
  .select([0])
  .rename('canopy_height')
  .clip(boundary);

// 4. Binary tree-canopy classification
var treeCanopy = canopyHeight
  .gte(3)
  .rename('tree_canopy')
  .toByte()
  .clip(boundary);

// 5. Display map
Map.centerObject(studyArea, 10);

Map.addLayer(
  treeCanopy.selfMask(),
  {palette: ['00FF00']},
  'Potential Tree Canopy >= 3 m'
);

Map.addLayer(
  studyArea.style({
    color: 'red',
    fillColor: '00000000',
    width: 2
  }),
  {},
  'Karachi Boundary'
);

// 6. Export binary canopy map
Export.image.toDrive({
  image: treeCanopy,
  description: 'Karachi_Tree_Canopy_3m',
  folder: 'Karachi_Tree_Research',
  fileNamePrefix: 'Karachi_Tree_Canopy_3m',
  region: boundary,
  scale: 1,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});

// 7. Export canopy-height map
Export.image.toDrive({
  image: canopyHeight,
  description: 'Karachi_Canopy_Height',
  folder: 'Karachi_Tree_Research',
  fileNamePrefix: 'Karachi_Canopy_Height',
  region: boundary,
  scale: 1,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});

// ============================================================
// END
// ============================================================
