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
        0.974,
        1.496,
        2.019,
        2.676,
        3.152,
        3.71,
        4.619,
        5.165,
        5.618,
        6.086,
        6.508,
        7.093,
        7.506,
        7.94,
        8.389,
        8.838,
        9.287,
        9.747,
        10.161,
        11.763,
        12.185,
        12.591,
        13.04,
        13.454,
        13.904,
        15.939,
        16.407,
        16.875,
        17.344,
        17.808,
        18.18,
        18.656,
        19.654,
        20.122,
        20.572,
        21.048,
        21.508,
        21.903,
        22.382,
        22.894,
        23.416,
        26.744,
        27.15,
        30.784,
        31.253,
        31.775,
        32.297,
        32.774,
        33.25,
        34.205,
        34.708,
        35.177,
        35.618,
        36.086,
        36.489,
        36.942,
        37.913,
        38.424,
        38.884,
        39.325,
        39.829,
        40.278,
        40.727,
        41.717,
        42.185,
        42.584,
        43.021,
        43.606,
        44.023,
        44.437,
        44.879,
        45.389,
        45.866,
        46.326,
        46.829,
        47.317,
        47.782,
        48.277,
        48.935,
        49.395,
        49.879,
        50.301,
        50.769,
        51.211,
        51.671,
        52.058,
        52.534,
        52.983,
        53.463,
        53.865,
        54.333,
        54.774,
        55.231,
        55.719,
        56.187,
        56.639,
        57.166,
        57.673,
        58.13,
        58.617,
        59.094,
        59.542,
        59.976,
        60.39,
        60.858,
        61.334,
        61.845,
        62.344,
        62.774,
        63.215,
        63.683,
        64.086,
        64.573,
        64.98,
        65.463,
        65.878,
        66.311,
        66.779,
        67.247,
        67.599,
        68.064,
        68.525,
        68.946,
        69.38,
        69.848,
        70.297,
        70.757,
        71.179,
        71.682,
        72.151,
        72.6,
        73.06,
        73.51,
        73.985,
        74.437,
        74.895,
        75.534,
        75.901,
        79.143,
        79.592,
        83.056,
        83.444,
        86.528,
        86.961
      ],
      "longPlates": [
        {
          "start": 10.629,
          "end": 11.446
        },
        {
          "start": 14.372,
          "end": 15.478
        },
        {
          "start": 23.911,
          "end": 26.357
        },
        {
          "start": 27.638,
          "end": 30.424
        },
        {
          "start": 76.334,
          "end": 78.845
        },
        {
          "start": 80.08,
          "end": 82.813
        },
        {
          "start": 83.904,
          "end": 86.214
        },
        {
          "start": 87.429,
          "end": 90.587
        }
      ]
    },
    {
      "tiles": [
        0.982,
        1.543,
        2.054,
        2.611,
        3.087,
        3.559,
        1.245,
        1.721,
        1.114,
        1.555,
        1.995,
        2.425,
        2.851,
        3.265,
        3.706,
        4.569,
        4.991,
        5.416,
        5.873,
        6.315,
        6.721,
        7.17,
        7.692,
        8.149,
        8.555,
        8.95,
        9.384,
        9.77,
        10.165,
        10.599,
        11.714,
        12.155,
        12.561,
        13.091,
        13.532,
        13.954,
        15.87,
        16.33,
        16.787,
        17.239,
        17.716,
        18.157,
        18.668,
        19.678,
        20.092,
        20.54,
        21.001,
        21.524,
        21.945,
        22.402,
        23.266,
        23.637,
        24.005,
        24.356,
        24.763,
        25.185,
        25.572,
        25.994,
        26.652,
        27.076,
        27.55,
        27.974,
        28.405,
        28.792,
        29.17,
        29.546,
        30.402,
        30.843,
        31.268,
        31.752,
        32.228,
        32.661,
        33.122,
        34.139,
        34.794,
        35.181,
        35.603,
        36.055,
        36.466,
        36.938,
        37.882,
        38.323,
        38.745,
        39.194,
        39.705,
        40.138,
        40.618,
        41.748,
        42.139,
        42.55,
        43.026,
        43.532,
        43.954,
        44.43,
        44.891,
        45.359,
        45.835,
        46.322,
        46.771,
        47.267,
        47.824,
        48.257,
        48.698,
        49.156,
        49.597,
        50.065,
        50.514,
        50.955,
        51.389,
        51.818,
        52.251,
        52.754,
        53.231,
        53.95,
        54.33,
        54.786,
        55.274,
        55.769,
        56.202,
        56.652,
        57.139,
        58.107,
        58.567,
        58.989,
        59.504,
        59.953,
        60.413,
        60.905,
        61.377,
        61.88,
        62.34,
        62.77,
        63.211,
        63.698,
        64.19,
        64.732,
        65.154,
        65.614,
        66.071,
        66.477,
        66.961,
        67.476,
        67.925,
        68.412,
        68.834,
        69.24,
        69.798,
        70.212,
        70.634,
        71.156,
        72.074,
        72.507,
        72.94,
        73.343,
        73.792,
        74.26,
        74.658,
        74.988,
        75.413,
        75.854,
        76.377,
        76.807,
        77.267,
        77.724,
        78.176,
        78.668,
        79.14,
        79.604,
        80.065,
        80.506,
        80.955,
        81.369,
        81.81,
        83.026,
        83.401,
        83.881,
        84.322,
        84.736,
        85.166,
        85.572,
        85.994,
        86.597,
        87.093,
        87.55,
        88.01,
        88.424,
        88.873,
        89.287,
        89.682
      ],
      "longPlates": [
        {
          "start": 0.335,
          "end": 0.974
        },
        {
          "start": 0.15,
          "end": 0.916
        },
        {
          "start": 14.449,
          "end": 15.475
        },
        {
          "start": 57.65,
          "end": 57.867
        },
        {
          "start": 71.586,
          "end": 71.787
        },
        {
          "start": 90.25,
          "end": 92.433
        }
      ]
    }
  ],
  "merged": {
    "tiles": [
      {
        "time": 1.079,
        "confidence": 2
      },
      {
        "time": 1.531,
        "confidence": 1.5
      },
      {
        "time": 1.721,
        "confidence": 0.5
      },
      {
        "time": 2.023,
        "confidence": 1.5
      },
      {
        "time": 2.425,
        "confidence": 0.5
      },
      {
        "time": 2.644,
        "confidence": 1
      },
      {
        "time": 2.851,
        "confidence": 0.5
      },
      {
        "time": 3.168,
        "confidence": 1.5
      },
      {
        "time": 3.658,
        "confidence": 1.5
      },
      {
        "time": 4.594,
        "confidence": 1
      },
      {
        "time": 4.991,
        "confidence": 0.5
      },
      {
        "time": 5.165,
        "confidence": 0.5
      },
      {
        "time": 5.416,
        "confidence": 0.5
      },
      {
        "time": 5.618,
        "confidence": 0.5
      },
      {
        "time": 5.873,
        "confidence": 0.5
      },
      {
        "time": 6.086,
        "confidence": 0.5
      },
      {
        "time": 6.315,
        "confidence": 0.5
      },
      {
        "time": 6.508,
        "confidence": 0.5
      },
      {
        "time": 6.721,
        "confidence": 0.5
      },
      {
        "time": 7.132,
        "confidence": 1
      },
      {
        "time": 7.506,
        "confidence": 0.5
      },
      {
        "time": 7.692,
        "confidence": 0.5
      },
      {
        "time": 7.94,
        "confidence": 0.5
      },
      {
        "time": 8.149,
        "confidence": 0.5
      },
      {
        "time": 8.389,
        "confidence": 0.5
      },
      {
        "time": 8.555,
        "confidence": 0.5
      },
      {
        "time": 8.894,
        "confidence": 1
      },
      {
        "time": 9.336,
        "confidence": 1
      },
      {
        "time": 9.759,
        "confidence": 1
      },
      {
        "time": 10.163,
        "confidence": 1
      },
      {
        "time": 10.599,
        "confidence": 0.5
      },
      {
        "time": 11.739,
        "confidence": 1
      },
      {
        "time": 12.17,
        "confidence": 1
      },
      {
        "time": 12.576,
        "confidence": 1
      },
      {
        "time": 13.066,
        "confidence": 1
      },
      {
        "time": 13.493,
        "confidence": 1
      },
      {
        "time": 13.929,
        "confidence": 1
      },
      {
        "time": 15.904,
        "confidence": 1
      },
      {
        "time": 16.368,
        "confidence": 1
      },
      {
        "time": 16.831,
        "confidence": 1
      },
      {
        "time": 17.292,
        "confidence": 1
      },
      {
        "time": 17.762,
        "confidence": 1
      },
      {
        "time": 18.169,
        "confidence": 1
      },
      {
        "time": 18.662,
        "confidence": 1
      },
      {
        "time": 19.666,
        "confidence": 1
      },
      {
        "time": 20.107,
        "confidence": 1
      },
      {
        "time": 20.556,
        "confidence": 1
      },
      {
        "time": 21.025,
        "confidence": 1
      },
      {
        "time": 21.516,
        "confidence": 1
      },
      {
        "time": 21.924,
        "confidence": 1
      },
      {
        "time": 22.392,
        "confidence": 1
      },
      {
        "time": 22.894,
        "confidence": 0.5
      },
      {
        "time": 23.266,
        "confidence": 0.5
      },
      {
        "time": 23.416,
        "confidence": 0.5
      },
      {
        "time": 23.637,
        "confidence": 0.5
      },
      {
        "time": 24.005,
        "confidence": 0.5
      },
      {
        "time": 24.356,
        "confidence": 0.5
      },
      {
        "time": 24.763,
        "confidence": 0.5
      },
      {
        "time": 25.185,
        "confidence": 0.5
      },
      {
        "time": 25.572,
        "confidence": 0.5
      },
      {
        "time": 25.994,
        "confidence": 0.5
      },
      {
        "time": 26.698,
        "confidence": 1
      },
      {
        "time": 27.113,
        "confidence": 1
      },
      {
        "time": 27.55,
        "confidence": 0.5
      },
      {
        "time": 27.974,
        "confidence": 0.5
      },
      {
        "time": 28.405,
        "confidence": 0.5
      },
      {
        "time": 28.792,
        "confidence": 0.5
      },
      {
        "time": 29.17,
        "confidence": 0.5
      },
      {
        "time": 29.546,
        "confidence": 0.5
      },
      {
        "time": 30.402,
        "confidence": 0.5
      },
      {
        "time": 30.813,
        "confidence": 1
      },
      {
        "time": 31.261,
        "confidence": 1
      },
      {
        "time": 31.764,
        "confidence": 1
      },
      {
        "time": 32.263,
        "confidence": 1
      },
      {
        "time": 32.718,
        "confidence": 1
      },
      {
        "time": 33.186,
        "confidence": 1
      },
      {
        "time": 34.172,
        "confidence": 1
      },
      {
        "time": 34.751,
        "confidence": 1
      },
      {
        "time": 35.179,
        "confidence": 1
      },
      {
        "time": 35.611,
        "confidence": 1
      },
      {
        "time": 36.07,
        "confidence": 1
      },
      {
        "time": 36.478,
        "confidence": 1
      },
      {
        "time": 36.94,
        "confidence": 1
      },
      {
        "time": 37.897,
        "confidence": 1
      },
      {
        "time": 38.374,
        "confidence": 1
      },
      {
        "time": 38.814,
        "confidence": 1
      },
      {
        "time": 39.26,
        "confidence": 1
      },
      {
        "time": 39.767,
        "confidence": 1
      },
      {
        "time": 40.208,
        "confidence": 1
      },
      {
        "time": 40.673,
        "confidence": 1
      },
      {
        "time": 41.733,
        "confidence": 1
      },
      {
        "time": 42.162,
        "confidence": 1
      },
      {
        "time": 42.567,
        "confidence": 1
      },
      {
        "time": 43.024,
        "confidence": 1
      },
      {
        "time": 43.569,
        "confidence": 1
      },
      {
        "time": 43.989,
        "confidence": 1
      },
      {
        "time": 44.433,
        "confidence": 1
      },
      {
        "time": 44.885,
        "confidence": 1
      },
      {
        "time": 45.374,
        "confidence": 1
      },
      {
        "time": 45.851,
        "confidence": 1
      },
      {
        "time": 46.324,
        "confidence": 1
      },
      {
        "time": 46.8,
        "confidence": 1
      },
      {
        "time": 47.292,
        "confidence": 1
      },
      {
        "time": 47.803,
        "confidence": 1
      },
      {
        "time": 48.267,
        "confidence": 1
      },
      {
        "time": 48.698,
        "confidence": 0.5
      },
      {
        "time": 48.935,
        "confidence": 0.5
      },
      {
        "time": 49.156,
        "confidence": 0.5
      },
      {
        "time": 49.395,
        "confidence": 0.5
      },
      {
        "time": 49.597,
        "confidence": 0.5
      },
      {
        "time": 49.879,
        "confidence": 0.5
      },
      {
        "time": 50.065,
        "confidence": 0.5
      },
      {
        "time": 50.301,
        "confidence": 0.5
      },
      {
        "time": 50.514,
        "confidence": 0.5
      },
      {
        "time": 50.769,
        "confidence": 0.5
      },
      {
        "time": 50.955,
        "confidence": 0.5
      },
      {
        "time": 51.211,
        "confidence": 0.5
      },
      {
        "time": 51.389,
        "confidence": 0.5
      },
      {
        "time": 51.745,
        "confidence": 1
      },
      {
        "time": 52.058,
        "confidence": 0.5
      },
      {
        "time": 52.251,
        "confidence": 0.5
      },
      {
        "time": 52.534,
        "confidence": 0.5
      },
      {
        "time": 52.754,
        "confidence": 0.5
      },
      {
        "time": 52.983,
        "confidence": 0.5
      },
      {
        "time": 53.231,
        "confidence": 0.5
      },
      {
        "time": 53.463,
        "confidence": 0.5
      },
      {
        "time": 53.908,
        "confidence": 1
      },
      {
        "time": 54.332,
        "confidence": 1
      },
      {
        "time": 54.78,
        "confidence": 1
      },
      {
        "time": 55.253,
        "confidence": 1
      },
      {
        "time": 55.744,
        "confidence": 1
      },
      {
        "time": 56.195,
        "confidence": 1
      },
      {
        "time": 56.646,
        "confidence": 1
      },
      {
        "time": 57.153,
        "confidence": 1
      },
      {
        "time": 57.673,
        "confidence": 0.5
      },
      {
        "time": 58.119,
        "confidence": 1
      },
      {
        "time": 58.592,
        "confidence": 1
      },
      {
        "time": 59.042,
        "confidence": 1
      },
      {
        "time": 59.523,
        "confidence": 1
      },
      {
        "time": 59.965,
        "confidence": 1
      },
      {
        "time": 60.402,
        "confidence": 1
      },
      {
        "time": 60.882,
        "confidence": 1
      },
      {
        "time": 61.356,
        "confidence": 1
      },
      {
        "time": 61.863,
        "confidence": 1
      },
      {
        "time": 62.342,
        "confidence": 1
      },
      {
        "time": 62.772,
        "confidence": 1
      },
      {
        "time": 63.213,
        "confidence": 1
      },
      {
        "time": 63.691,
        "confidence": 1
      },
      {
        "time": 64.138,
        "confidence": 1
      },
      {
        "time": 64.573,
        "confidence": 0.5
      },
      {
        "time": 64.732,
        "confidence": 0.5
      },
      {
        "time": 64.98,
        "confidence": 0.5
      },
      {
        "time": 65.154,
        "confidence": 0.5
      },
      {
        "time": 65.463,
        "confidence": 0.5
      },
      {
        "time": 65.614,
        "confidence": 0.5
      },
      {
        "time": 65.878,
        "confidence": 0.5
      },
      {
        "time": 66.071,
        "confidence": 0.5
      },
      {
        "time": 66.311,
        "confidence": 0.5
      },
      {
        "time": 66.477,
        "confidence": 0.5
      },
      {
        "time": 66.779,
        "confidence": 0.5
      },
      {
        "time": 66.961,
        "confidence": 0.5
      },
      {
        "time": 67.247,
        "confidence": 0.5
      },
      {
        "time": 67.538,
        "confidence": 1
      },
      {
        "time": 67.994,
        "confidence": 1
      },
      {
        "time": 68.469,
        "confidence": 1
      },
      {
        "time": 68.89,
        "confidence": 1
      },
      {
        "time": 69.31,
        "confidence": 1
      },
      {
        "time": 69.823,
        "confidence": 1
      },
      {
        "time": 70.255,
        "confidence": 1
      },
      {
        "time": 70.696,
        "confidence": 1
      },
      {
        "time": 71.168,
        "confidence": 1
      },
      {
        "time": 71.682,
        "confidence": 0.5
      },
      {
        "time": 72.113,
        "confidence": 1
      },
      {
        "time": 72.554,
        "confidence": 1
      },
      {
        "time": 73,
        "confidence": 1
      },
      {
        "time": 73.343,
        "confidence": 0.5
      },
      {
        "time": 73.51,
        "confidence": 0.5
      },
      {
        "time": 73.792,
        "confidence": 0.5
      },
      {
        "time": 73.985,
        "confidence": 0.5
      },
      {
        "time": 74.26,
        "confidence": 0.5
      },
      {
        "time": 74.437,
        "confidence": 0.5
      },
      {
        "time": 74.658,
        "confidence": 0.5
      },
      {
        "time": 74.941,
        "confidence": 1
      },
      {
        "time": 75.474,
        "confidence": 1
      },
      {
        "time": 75.878,
        "confidence": 1
      },
      {
        "time": 76.377,
        "confidence": 0.5
      },
      {
        "time": 76.807,
        "confidence": 0.5
      },
      {
        "time": 77.267,
        "confidence": 0.5
      },
      {
        "time": 77.724,
        "confidence": 0.5
      },
      {
        "time": 78.176,
        "confidence": 0.5
      },
      {
        "time": 78.668,
        "confidence": 0.5
      },
      {
        "time": 79.142,
        "confidence": 1
      },
      {
        "time": 79.598,
        "confidence": 1
      },
      {
        "time": 80.065,
        "confidence": 0.5
      },
      {
        "time": 80.506,
        "confidence": 0.5
      },
      {
        "time": 80.955,
        "confidence": 0.5
      },
      {
        "time": 81.369,
        "confidence": 0.5
      },
      {
        "time": 81.81,
        "confidence": 0.5
      },
      {
        "time": 83.041,
        "confidence": 1
      },
      {
        "time": 83.423,
        "confidence": 1
      },
      {
        "time": 83.881,
        "confidence": 0.5
      },
      {
        "time": 84.322,
        "confidence": 0.5
      },
      {
        "time": 84.736,
        "confidence": 0.5
      },
      {
        "time": 85.166,
        "confidence": 0.5
      },
      {
        "time": 85.572,
        "confidence": 0.5
      },
      {
        "time": 85.994,
        "confidence": 0.5
      },
      {
        "time": 86.563,
        "confidence": 1
      },
      {
        "time": 87.027,
        "confidence": 1
      },
      {
        "time": 87.55,
        "confidence": 0.5
      },
      {
        "time": 88.01,
        "confidence": 0.5
      },
      {
        "time": 88.424,
        "confidence": 0.5
      },
      {
        "time": 88.873,
        "confidence": 0.5
      },
      {
        "time": 89.287,
        "confidence": 0.5
      },
      {
        "time": 89.682,
        "confidence": 0.5
      }
    ],
    "longPlates": [
      {
        "start": 0.243,
        "end": 0.945,
        "confidence": 1
      },
      {
        "start": 10.629,
        "end": 11.446,
        "confidence": 0.5
      },
      {
        "start": 14.41,
        "end": 15.477,
        "confidence": 1
      },
      {
        "start": 23.911,
        "end": 26.357,
        "confidence": 0.5
      },
      {
        "start": 27.638,
        "end": 30.424,
        "confidence": 0.5
      },
      {
        "start": 57.65,
        "end": 57.867,
        "confidence": 0.5
      },
      {
        "start": 71.586,
        "end": 71.787,
        "confidence": 0.5
      },
      {
        "start": 76.334,
        "end": 78.845,
        "confidence": 0.5
      },
      {
        "start": 80.08,
        "end": 82.813,
        "confidence": 0.5
      },
      {
        "start": 83.904,
        "end": 86.214,
        "confidence": 0.5
      },
      {
        "start": 88.84,
        "end": 91.51,
        "confidence": 1
      }
    ]
  }
};
})(window.TH = window.TH || {});
