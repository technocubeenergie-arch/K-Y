/*
 * beatmapData.js
 * ------------------------------------------------------------
 * Role: le rythme de phuthona.ogg posé À LA MAIN, tuile par tuile et
 * tapis glissant par tapis glissant, avec tools/beatmap-editor/ (voir
 * docs/BEATMAP_EDITOR.md) — plutôt que deviné automatiquement par
 * audio/beatDetector.js.
 *
 * `takes` garde la prise brute (utile pour refaire une fusion avec
 * une autre tolérance plus tard, sans tout retaper) ; `merged` est le
 * résultat prêt à l'emploi, utilisé par main.js à la place de
 * `BeatDetector.detectOnsets(...)` quand `config.beatmap.useManualData`
 * vaut true (voir level/levelSequencer.js, `explicitLongPlates`).
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  TH.BeatmapData = {
  "song": "phuthona.ogg",
  "takes": [
    {
      "tiles": [
        1.752,
        2.391,
        3.076,
        4.759,
        5.317,
        5.948,
        6.505,
        8.502,
        10.34,
        10.924,
        11.706,
        13.892,
        15.97,
        17.492,
        18.714,
        22.298,
        26.722,
        27.306,
        30.541,
        31.052,
        31.52,
        31.935,
        32.403,
        32.817,
        33.3,
        34.14,
        34.686,
        35.235,
        35.65,
        36.118,
        36.586,
        37.171,
        37.972,
        38.44,
        38.862,
        39.311,
        39.853,
        40.302,
        41.687,
        42.202,
        42.643,
        43.092,
        43.595,
        44.055,
        44.504,
        44.938,
        45.476,
        45.936,
        46.385,
        46.861,
        47.31,
        47.817,
        48.211,
        48.653,
        49.706,
        50.604,
        51.072,
        51.54,
        51.981,
        52.585,
        53.069,
        53.51,
        53.962,
        54.915,
        55.41,
        55.867,
        56.327,
        56.803,
        57.306,
        57.705,
        58.235,
        58.722,
        59.172,
        59.612,
        60.135,
        60.576,
        61.053,
        61.556,
        61.996,
        62.457,
        62.906,
        63.355,
        63.796,
        64.284,
        64.787,
        65.236,
        65.739,
        66.227,
        66.722,
        67.233,
        67.728,
        68.197,
        68.684,
        69.16,
        69.663,
        70.166,
        70.627,
        71.129,
        71.644,
        72.155,
        72.589,
        73.073,
        73.533,
        74.055,
        74.524,
        74.965,
        79.291,
        79.698,
        82.972,
        83.394,
        86.645,
        87.066,
        0,
        0.914,
        1.41,
        1.859,
        2.292,
        2.749,
        3.128,
        4.731,
        5.152,
        5.594,
        6.019,
        6.449,
        6.897,
        8.662,
        9.177,
        9.68,
        10.226,
        10.856,
        11.801,
        12.594,
        13.105,
        13.593,
        14.034,
        14.463,
        2.134,
        2.737,
        5.876,
        6.453,
        7.01,
        7.443,
        8.26,
        8.891,
        9.513,
        10.098,
        11.843,
        12.49,
        13.112,
        5.284,
        6.929,
        8.91,
        9.773,
        13.949,
        18.566,
        22.919,
        26.716,
        27.23,
        30.543,
        31.171,
        40.621,
        45.516,
        46.073,
        46.631,
        47.71,
        48.782,
        49.293,
        49.804,
        50.23,
        50.884,
        51.391,
        51.848,
        52.613,
        53.477,
        53.864,
        54.332,
        54.792,
        55.261,
        55.709,
        56.151,
        56.7,
        57.285,
        58.202,
        58.679,
        59.22,
        59.634,
        60.055,
        60.47,
        60.938,
        61.398,
        61.863,
        62.35,
        62.792,
        63.233,
        63.69,
        64.556,
        65.048,
        65.563,
        66.039,
        66.445,
        66.948,
        67.517,
        68.515,
        69.007,
        69.449,
        69.909,
        70.349,
        70.791,
        71.259,
        71.708,
        72.176,
        72.637,
        73.094,
        73.535,
        73.995,
        74.471,
        74.901,
        75.478,
        76.054,
        79.185,
        79.626,
        82.958,
        83.415,
        86.639,
        87.122
      ],
      "longPlates": [
        {
          "start": 1.06,
          "end": 1.269
        },
        {
          "start": 3.699,
          "end": 4.38
        },
        {
          "start": 7.244,
          "end": 8.169
        },
        {
          "start": 9.059,
          "end": 9.26
        },
        {
          "start": 9.744,
          "end": 9.96
        },
        {
          "start": 12.461,
          "end": 12.731
        },
        {
          "start": 13.154,
          "end": 13.37
        },
        {
          "start": 14.647,
          "end": 15.394
        },
        {
          "start": 16.645,
          "end": 16.861
        },
        {
          "start": 18.095,
          "end": 18.355
        },
        {
          "start": 19.605,
          "end": 19.875
        },
        {
          "start": 20.301,
          "end": 20.514
        },
        {
          "start": 21.002,
          "end": 21.218
        },
        {
          "start": 21.594,
          "end": 21.818
        },
        {
          "start": 22.979,
          "end": 23.18
        },
        {
          "start": 23.494,
          "end": 26.265
        },
        {
          "start": 27.848,
          "end": 30.069
        },
        {
          "start": 40.723,
          "end": 40.924
        },
        {
          "start": 49.237,
          "end": 49.442
        },
        {
          "start": 50.154,
          "end": 50.379
        },
        {
          "start": 54.427,
          "end": 54.628
        },
        {
          "start": 75.576,
          "end": 78.993
        },
        {
          "start": 80.128,
          "end": 82.577
        },
        {
          "start": 83.889,
          "end": 86.273
        },
        {
          "start": 87.55,
          "end": 92.433
        },
        {
          "start": 3.623,
          "end": 4.316
        },
        {
          "start": 7.447,
          "end": 8.016
        },
        {
          "start": 14.924,
          "end": 15.492
        },
        {
          "start": 0.992,
          "end": 1.197
        },
        {
          "start": 1.549,
          "end": 1.766
        },
        {
          "start": 3.349,
          "end": 3.557
        },
        {
          "start": 4.474,
          "end": 4.68
        },
        {
          "start": 5.156,
          "end": 5.357
        },
        {
          "start": 10.701,
          "end": 11.085
        },
        {
          "start": 0.98,
          "end": 1.205
        },
        {
          "start": 1.728,
          "end": 1.944
        },
        {
          "start": 2.567,
          "end": 2.872
        },
        {
          "start": 3.33,
          "end": 3.557
        },
        {
          "start": 4.579,
          "end": 4.823
        },
        {
          "start": 6.046,
          "end": 6.263
        },
        {
          "start": 8.001,
          "end": 8.271
        },
        {
          "start": 10.745,
          "end": 11.654
        },
        {
          "start": 12.157,
          "end": 12.381
        },
        {
          "start": 13.128,
          "end": 13.356
        },
        {
          "start": 14.66,
          "end": 15.485
        },
        {
          "start": 16.124,
          "end": 16.352
        },
        {
          "start": 16.925,
          "end": 17.18
        },
        {
          "start": 17.757,
          "end": 17.981
        },
        {
          "start": 19.653,
          "end": 19.869
        },
        {
          "start": 20.372,
          "end": 20.636
        },
        {
          "start": 21.147,
          "end": 21.39
        },
        {
          "start": 21.994,
          "end": 22.226
        },
        {
          "start": 23.829,
          "end": 26.32
        },
        {
          "start": 27.698,
          "end": 30.144
        },
        {
          "start": 31.991,
          "end": 32.195
        },
        {
          "start": 32.854,
          "end": 33.07
        },
        {
          "start": 33.5,
          "end": 33.708
        },
        {
          "start": 34.339,
          "end": 34.572
        },
        {
          "start": 35.102,
          "end": 35.31
        },
        {
          "start": 36.023,
          "end": 36.244
        },
        {
          "start": 36.975,
          "end": 37.471
        },
        {
          "start": 38.044,
          "end": 38.279
        },
        {
          "start": 38.829,
          "end": 39.127
        },
        {
          "start": 39.7,
          "end": 39.954
        },
        {
          "start": 41.673,
          "end": 41.925
        },
        {
          "start": 42.474,
          "end": 42.733
        },
        {
          "start": 43.345,
          "end": 43.589
        },
        {
          "start": 44.173,
          "end": 44.39
        },
        {
          "start": 44.975,
          "end": 45.179
        },
        {
          "start": 47.153,
          "end": 47.358
        },
        {
          "start": 48.221,
          "end": 48.43
        },
        {
          "start": 53.009,
          "end": 53.225
        },
        {
          "start": 57.726,
          "end": 57.931
        },
        {
          "start": 64.131,
          "end": 64.347
        },
        {
          "start": 68.036,
          "end": 68.236
        },
        {
          "start": 76.46,
          "end": 78.879
        },
        {
          "start": 80.095,
          "end": 82.622
        },
        {
          "start": 83.883,
          "end": 86.313
        },
        {
          "start": 87.618,
          "end": 90.226
        }
      ]
    }
  ],
  "merged": {
    "tiles": [
      {
        "time": 0,
        "confidence": 1
      },
      {
        "time": 0.914,
        "confidence": 1
      },
      {
        "time": 1.41,
        "confidence": 1
      },
      {
        "time": 1.805,
        "confidence": 2
      },
      {
        "time": 2.134,
        "confidence": 1
      },
      {
        "time": 2.342,
        "confidence": 2
      },
      {
        "time": 2.743,
        "confidence": 2
      },
      {
        "time": 3.102,
        "confidence": 2
      },
      {
        "time": 4.745,
        "confidence": 2
      },
      {
        "time": 5.251,
        "confidence": 3
      },
      {
        "time": 5.594,
        "confidence": 1
      },
      {
        "time": 5.948,
        "confidence": 3
      },
      {
        "time": 6.469,
        "confidence": 3
      },
      {
        "time": 6.945,
        "confidence": 3
      },
      {
        "time": 7.443,
        "confidence": 1
      },
      {
        "time": 8.26,
        "confidence": 1
      },
      {
        "time": 8.502,
        "confidence": 1
      },
      {
        "time": 8.662,
        "confidence": 1
      },
      {
        "time": 8.901,
        "confidence": 2
      },
      {
        "time": 9.177,
        "confidence": 1
      },
      {
        "time": 9.513,
        "confidence": 1
      },
      {
        "time": 9.727,
        "confidence": 2
      },
      {
        "time": 10.221,
        "confidence": 3
      },
      {
        "time": 10.89,
        "confidence": 2
      },
      {
        "time": 11.783,
        "confidence": 3
      },
      {
        "time": 12.542,
        "confidence": 2
      },
      {
        "time": 13.109,
        "confidence": 2
      },
      {
        "time": 13.593,
        "confidence": 1
      },
      {
        "time": 13.958,
        "confidence": 3
      },
      {
        "time": 14.463,
        "confidence": 1
      },
      {
        "time": 15.97,
        "confidence": 1
      },
      {
        "time": 17.492,
        "confidence": 1
      },
      {
        "time": 18.64,
        "confidence": 2
      },
      {
        "time": 22.298,
        "confidence": 1
      },
      {
        "time": 22.919,
        "confidence": 1
      },
      {
        "time": 26.719,
        "confidence": 2
      },
      {
        "time": 27.268,
        "confidence": 2
      },
      {
        "time": 30.542,
        "confidence": 2
      },
      {
        "time": 31.112,
        "confidence": 2
      },
      {
        "time": 31.52,
        "confidence": 1
      },
      {
        "time": 31.935,
        "confidence": 1
      },
      {
        "time": 32.403,
        "confidence": 1
      },
      {
        "time": 32.817,
        "confidence": 1
      },
      {
        "time": 33.3,
        "confidence": 1
      },
      {
        "time": 34.14,
        "confidence": 1
      },
      {
        "time": 34.686,
        "confidence": 1
      },
      {
        "time": 35.235,
        "confidence": 1
      },
      {
        "time": 35.65,
        "confidence": 1
      },
      {
        "time": 36.118,
        "confidence": 1
      },
      {
        "time": 36.586,
        "confidence": 1
      },
      {
        "time": 37.171,
        "confidence": 1
      },
      {
        "time": 37.972,
        "confidence": 1
      },
      {
        "time": 38.44,
        "confidence": 1
      },
      {
        "time": 38.862,
        "confidence": 1
      },
      {
        "time": 39.311,
        "confidence": 1
      },
      {
        "time": 39.853,
        "confidence": 1
      },
      {
        "time": 40.302,
        "confidence": 1
      },
      {
        "time": 40.621,
        "confidence": 1
      },
      {
        "time": 41.687,
        "confidence": 1
      },
      {
        "time": 42.202,
        "confidence": 1
      },
      {
        "time": 42.643,
        "confidence": 1
      },
      {
        "time": 43.092,
        "confidence": 1
      },
      {
        "time": 43.595,
        "confidence": 1
      },
      {
        "time": 44.055,
        "confidence": 1
      },
      {
        "time": 44.504,
        "confidence": 1
      },
      {
        "time": 44.938,
        "confidence": 1
      },
      {
        "time": 45.496,
        "confidence": 2
      },
      {
        "time": 46.005,
        "confidence": 2
      },
      {
        "time": 46.385,
        "confidence": 1
      },
      {
        "time": 46.631,
        "confidence": 1
      },
      {
        "time": 46.861,
        "confidence": 1
      },
      {
        "time": 47.31,
        "confidence": 1
      },
      {
        "time": 47.764,
        "confidence": 2
      },
      {
        "time": 48.211,
        "confidence": 1
      },
      {
        "time": 48.718,
        "confidence": 2
      },
      {
        "time": 49.293,
        "confidence": 1
      },
      {
        "time": 49.755,
        "confidence": 2
      },
      {
        "time": 50.23,
        "confidence": 1
      },
      {
        "time": 50.604,
        "confidence": 1
      },
      {
        "time": 50.884,
        "confidence": 1
      },
      {
        "time": 51.072,
        "confidence": 1
      },
      {
        "time": 51.466,
        "confidence": 2
      },
      {
        "time": 51.915,
        "confidence": 2
      },
      {
        "time": 52.599,
        "confidence": 2
      },
      {
        "time": 53.069,
        "confidence": 1
      },
      {
        "time": 53.494,
        "confidence": 2
      },
      {
        "time": 53.913,
        "confidence": 2
      },
      {
        "time": 54.332,
        "confidence": 1
      },
      {
        "time": 54.854,
        "confidence": 2
      },
      {
        "time": 55.335,
        "confidence": 2
      },
      {
        "time": 55.709,
        "confidence": 1
      },
      {
        "time": 55.867,
        "confidence": 1
      },
      {
        "time": 56.151,
        "confidence": 1
      },
      {
        "time": 56.327,
        "confidence": 1
      },
      {
        "time": 56.752,
        "confidence": 2
      },
      {
        "time": 57.296,
        "confidence": 2
      },
      {
        "time": 57.705,
        "confidence": 1
      },
      {
        "time": 58.219,
        "confidence": 2
      },
      {
        "time": 58.701,
        "confidence": 2
      },
      {
        "time": 59.196,
        "confidence": 2
      },
      {
        "time": 59.623,
        "confidence": 2
      },
      {
        "time": 60.095,
        "confidence": 2
      },
      {
        "time": 60.523,
        "confidence": 2
      },
      {
        "time": 60.996,
        "confidence": 2
      },
      {
        "time": 61.398,
        "confidence": 1
      },
      {
        "time": 61.556,
        "confidence": 1
      },
      {
        "time": 61.93,
        "confidence": 2
      },
      {
        "time": 62.404,
        "confidence": 2
      },
      {
        "time": 62.849,
        "confidence": 2
      },
      {
        "time": 63.294,
        "confidence": 2
      },
      {
        "time": 63.743,
        "confidence": 2
      },
      {
        "time": 64.284,
        "confidence": 1
      },
      {
        "time": 64.556,
        "confidence": 1
      },
      {
        "time": 64.787,
        "confidence": 1
      },
      {
        "time": 65.048,
        "confidence": 1
      },
      {
        "time": 65.236,
        "confidence": 1
      },
      {
        "time": 65.563,
        "confidence": 1
      },
      {
        "time": 65.739,
        "confidence": 1
      },
      {
        "time": 66.039,
        "confidence": 1
      },
      {
        "time": 66.227,
        "confidence": 1
      },
      {
        "time": 66.445,
        "confidence": 1
      },
      {
        "time": 66.722,
        "confidence": 1
      },
      {
        "time": 66.948,
        "confidence": 1
      },
      {
        "time": 67.233,
        "confidence": 1
      },
      {
        "time": 67.517,
        "confidence": 1
      },
      {
        "time": 67.728,
        "confidence": 1
      },
      {
        "time": 68.197,
        "confidence": 1
      },
      {
        "time": 68.515,
        "confidence": 1
      },
      {
        "time": 68.684,
        "confidence": 1
      },
      {
        "time": 69.007,
        "confidence": 1
      },
      {
        "time": 69.16,
        "confidence": 1
      },
      {
        "time": 69.449,
        "confidence": 1
      },
      {
        "time": 69.663,
        "confidence": 1
      },
      {
        "time": 69.909,
        "confidence": 1
      },
      {
        "time": 70.166,
        "confidence": 1
      },
      {
        "time": 70.349,
        "confidence": 1
      },
      {
        "time": 70.627,
        "confidence": 1
      },
      {
        "time": 70.791,
        "confidence": 1
      },
      {
        "time": 71.194,
        "confidence": 2
      },
      {
        "time": 71.676,
        "confidence": 2
      },
      {
        "time": 72.166,
        "confidence": 2
      },
      {
        "time": 72.613,
        "confidence": 2
      },
      {
        "time": 73.083,
        "confidence": 2
      },
      {
        "time": 73.534,
        "confidence": 2
      },
      {
        "time": 74.025,
        "confidence": 2
      },
      {
        "time": 74.498,
        "confidence": 2
      },
      {
        "time": 74.933,
        "confidence": 2
      },
      {
        "time": 75.478,
        "confidence": 1
      },
      {
        "time": 76.054,
        "confidence": 1
      },
      {
        "time": 79.238,
        "confidence": 2
      },
      {
        "time": 79.662,
        "confidence": 2
      },
      {
        "time": 82.965,
        "confidence": 2
      },
      {
        "time": 83.405,
        "confidence": 2
      },
      {
        "time": 86.642,
        "confidence": 2
      },
      {
        "time": 87.094,
        "confidence": 2
      }
    ],
    "longPlates": [
      {
        "start": 1.262,
        "end": 1.476,
        "confidence": 5
      },
      {
        "start": 2.567,
        "end": 2.872,
        "confidence": 1
      },
      {
        "start": 3.842,
        "end": 4.219,
        "confidence": 6
      },
      {
        "start": 5.156,
        "end": 5.357,
        "confidence": 1
      },
      {
        "start": 6.046,
        "end": 6.263,
        "confidence": 1
      },
      {
        "start": 7.564,
        "end": 8.152,
        "confidence": 3
      },
      {
        "start": 9.059,
        "end": 9.26,
        "confidence": 1
      },
      {
        "start": 9.744,
        "end": 9.96,
        "confidence": 1
      },
      {
        "start": 10.723,
        "end": 11.37,
        "confidence": 2
      },
      {
        "start": 12.309,
        "end": 12.556,
        "confidence": 2
      },
      {
        "start": 13.141,
        "end": 13.363,
        "confidence": 2
      },
      {
        "start": 14.744,
        "end": 15.457,
        "confidence": 3
      },
      {
        "start": 16.565,
        "end": 16.798,
        "confidence": 3
      },
      {
        "start": 17.926,
        "end": 18.168,
        "confidence": 2
      },
      {
        "start": 19.629,
        "end": 19.872,
        "confidence": 2
      },
      {
        "start": 20.337,
        "end": 20.575,
        "confidence": 2
      },
      {
        "start": 21.434,
        "end": 21.663,
        "confidence": 4
      },
      {
        "start": 22.979,
        "end": 23.18,
        "confidence": 1
      },
      {
        "start": 23.662,
        "end": 26.293,
        "confidence": 2
      },
      {
        "start": 27.773,
        "end": 30.106,
        "confidence": 2
      },
      {
        "start": 31.991,
        "end": 32.195,
        "confidence": 1
      },
      {
        "start": 32.854,
        "end": 33.07,
        "confidence": 1
      },
      {
        "start": 33.5,
        "end": 33.708,
        "confidence": 1
      },
      {
        "start": 34.339,
        "end": 34.572,
        "confidence": 1
      },
      {
        "start": 35.102,
        "end": 35.31,
        "confidence": 1
      },
      {
        "start": 36.023,
        "end": 36.244,
        "confidence": 1
      },
      {
        "start": 36.975,
        "end": 37.471,
        "confidence": 1
      },
      {
        "start": 38.044,
        "end": 38.279,
        "confidence": 1
      },
      {
        "start": 38.829,
        "end": 39.127,
        "confidence": 1
      },
      {
        "start": 39.7,
        "end": 39.954,
        "confidence": 1
      },
      {
        "start": 40.723,
        "end": 40.924,
        "confidence": 1
      },
      {
        "start": 41.673,
        "end": 41.925,
        "confidence": 1
      },
      {
        "start": 42.474,
        "end": 42.733,
        "confidence": 1
      },
      {
        "start": 43.345,
        "end": 43.589,
        "confidence": 1
      },
      {
        "start": 44.173,
        "end": 44.39,
        "confidence": 1
      },
      {
        "start": 44.975,
        "end": 45.179,
        "confidence": 1
      },
      {
        "start": 47.153,
        "end": 47.358,
        "confidence": 1
      },
      {
        "start": 48.221,
        "end": 48.43,
        "confidence": 1
      },
      {
        "start": 49.237,
        "end": 49.442,
        "confidence": 1
      },
      {
        "start": 50.154,
        "end": 50.379,
        "confidence": 1
      },
      {
        "start": 53.009,
        "end": 53.225,
        "confidence": 1
      },
      {
        "start": 54.427,
        "end": 54.628,
        "confidence": 1
      },
      {
        "start": 57.726,
        "end": 57.931,
        "confidence": 1
      },
      {
        "start": 64.131,
        "end": 64.347,
        "confidence": 1
      },
      {
        "start": 68.036,
        "end": 68.236,
        "confidence": 1
      },
      {
        "start": 76.018,
        "end": 78.936,
        "confidence": 2
      },
      {
        "start": 80.112,
        "end": 82.6,
        "confidence": 2
      },
      {
        "start": 83.886,
        "end": 86.293,
        "confidence": 2
      },
      {
        "start": 87.584,
        "end": 91.33,
        "confidence": 2
      }
    ]
  }
};
})(window.TH = window.TH || {});
