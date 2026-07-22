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
        2.063,
        0.397,
        0.919,
        1.407,
        1.828,
        2.25,
        2.664,
        3.125,
        3.539,
        5.013,
        5.447,
        5.914,
        6.344,
        6.766,
        8.415,
        8.837,
        9.278,
        9.746,
        10.927,
        11.294,
        11.708,
        12.114,
        12.501,
        12.986,
        13.454,
        13.949,
        14.444,
        14.878,
        16.476,
        16.863,
        17.277,
        17.726,
        18.167,
        18.628,
        19.115,
        19.591,
        20.006,
        20.462,
        20.923,
        21.391,
        21.759,
        22.281,
        22.776,
        23.206,
        23.694,
        24.162,
        24.665,
        25.134,
        25.628,
        26.124,
        26.627,
        27.095,
        27.572,
        28.094,
        28.562,
        29.011,
        30.927,
        31.379,
        31.828,
        32.296,
        32.726,
        33.187,
        33.647,
        34.115,
        34.572,
        35.041,
        35.501,
        35.949,
        36.391,
        36.859,
        37.354,
        37.803,
        38.299,
        38.729,
        39.235,
        39.495,
        40.079,
        40.602,
        41.151,
        41.654,
        42.115,
        42.591,
        43.021,
        43.508,
        43.922,
        44.425,
        44.913,
        45.381,
        45.892,
        46.399,
        46.855,
        47.332,
        47.781,
        48.249,
        48.709,
        49.185,
        49.654,
        50.103,
        50.582,
        51.039,
        51.534,
        52.003,
        52.479,
        52.939,
        53.423,
        53.845,
        54.368,
        54.809,
        55.261,
        55.726,
        56.232,
        56.701,
        57.185,
        57.645,
        58.102,
        58.562,
        59.023,
        59.704,
        60.029,
        60.47,
        60.946,
        61.36,
        61.821,
        62.277,
        62.773,
        63.206,
        63.702,
        64.177,
        64.654,
        65.122,
        65.571,
        66.094,
        66.542,
        67.003,
        67.498,
        67.92,
        68.415,
        68.876,
        69.387,
        69.839,
        70.35,
        70.772,
        71.206,
        71.662,
        72.123,
        72.591,
        73.079,
        73.508,
        74.012,
        74.499,
        74.96,
        75.389,
        76.828,
        77.297,
        77.773,
        78.222,
        78.675,
        79.159,
        79.619,
        80.068,
        80.525,
        80.996,
        81.407,
        81.894,
        82.417,
        83.02,
        83.442,
        83.876,
        84.306,
        84.747,
        85.215,
        85.71,
        86.186,
        86.655,
        87.096,
        87.591,
        88.048,
        88.508,
        88.949,
        89.452,
        89.948,
        90.405,
        90.919,
        1.695,
        2.102,
        2.694,
        3.29,
        3.676,
        4.574,
        5.151,
        5.673,
        6.212,
        6.672,
        8.425,
        8.905,
        9.4,
        9.876,
        10.317,
        11.854,
        12.369,
        12.918,
        13.394,
        13.897,
        15.929,
        16.266,
        16.831,
        17.354,
        17.802,
        18.235,
        19.505,
        20.116,
        20.584,
        21.095,
        21.591,
        22.005,
        22.59,
        23.148,
        23.498,
        26.676,
        27.168,
        30.535,
        30.949,
        31.354,
        32.009,
        32.399,
        32.783,
        33.216,
        34.602,
        35.062,
        35.538,
        36.034,
        36.428,
        38.057,
        38.453,
        38.847,
        39.288,
        39.865,
        40.287,
        41.684,
        42.198,
        42.639,
        43.178,
        43.608,
        44.025,
        44.474,
        45.047,
        45.426,
        45.913,
        46.382,
        46.831,
        47.326,
        47.775,
        48.243,
        48.704,
        49.215,
        49.71,
        50.33,
        50.728,
        51.177,
        51.637,
        52.059,
        53.553,
        53.967,
        54.416,
        54.974,
        55.345,
        55.759,
        56.216,
        56.703,
        57.226,
        57.656,
        58.105,
        58.7,
        59.087,
        59.501,
        59.95,
        60.454,
        60.96,
        61.425,
        61.885,
        62.38,
        62.883,
        63.368,
        63.828,
        64.315,
        64.807,
        65.232,
        65.701,
        66.161,
        66.584,
        67.032,
        67.481,
        67.977,
        68.472,
        68.929,
        69.37,
        69.811,
        70.705,
        71.142,
        71.657,
        72.323,
        72.691,
        73.132,
        73.592,
        73.987,
        74.474,
        74.88,
        76.425,
        79.188,
        79.64,
        83.274,
        83.65,
        84.048,
        86.711,
        87.133
      ],
      "longPlates": [
        {
          "start": 0.922,
          "end": 1.138
        },
        {
          "start": 7.181,
          "end": 8.082
        },
        {
          "start": 10.16,
          "end": 10.493
        },
        {
          "start": 15.462,
          "end": 16.306
        },
        {
          "start": 29.452,
          "end": 30.749
        },
        {
          "start": 75.846,
          "end": 76.414
        },
        {
          "start": 0.975,
          "end": 1.192
        },
        {
          "start": 7.256,
          "end": 7.968
        },
        {
          "start": 10.712,
          "end": 11.521
        },
        {
          "start": 14.463,
          "end": 15.634
        },
        {
          "start": 18.785,
          "end": 19.214
        },
        {
          "start": 23.912,
          "end": 26.088
        },
        {
          "start": 27.609,
          "end": 30.066
        },
        {
          "start": 34.161,
          "end": 34.361
        },
        {
          "start": 36.943,
          "end": 37.527
        },
        {
          "start": 40.728,
          "end": 40.929
        },
        {
          "start": 52.554,
          "end": 52.759
        },
        {
          "start": 53.031,
          "end": 53.247
        },
        {
          "start": 70.225,
          "end": 70.433
        },
        {
          "start": 75.372,
          "end": 76.309
        },
        {
          "start": 76.812,
          "end": 78.882
        },
        {
          "start": 80.063,
          "end": 80.322
        },
        {
          "start": 80.485,
          "end": 82.678
        },
        {
          "start": 84.354,
          "end": 86.296
        },
        {
          "start": 87.655,
          "end": 92.433
        }
      ]
    }
  ],
  "merged": {
    "tiles": [
      {
        "time": 0.397,
        "confidence": 1
      },
      {
        "time": 0.919,
        "confidence": 1
      },
      {
        "time": 1.407,
        "confidence": 1
      },
      {
        "time": 1.762,
        "confidence": 2
      },
      {
        "time": 2.138,
        "confidence": 3
      },
      {
        "time": 2.679,
        "confidence": 2
      },
      {
        "time": 3.125,
        "confidence": 1
      },
      {
        "time": 3.29,
        "confidence": 1
      },
      {
        "time": 3.608,
        "confidence": 2
      },
      {
        "time": 4.574,
        "confidence": 1
      },
      {
        "time": 5.082,
        "confidence": 2
      },
      {
        "time": 5.447,
        "confidence": 1
      },
      {
        "time": 5.673,
        "confidence": 1
      },
      {
        "time": 5.914,
        "confidence": 1
      },
      {
        "time": 6.278,
        "confidence": 2
      },
      {
        "time": 6.719,
        "confidence": 2
      },
      {
        "time": 8.42,
        "confidence": 2
      },
      {
        "time": 8.871,
        "confidence": 2
      },
      {
        "time": 9.339,
        "confidence": 2
      },
      {
        "time": 9.811,
        "confidence": 2
      },
      {
        "time": 10.317,
        "confidence": 1
      },
      {
        "time": 10.927,
        "confidence": 1
      },
      {
        "time": 11.294,
        "confidence": 1
      },
      {
        "time": 11.781,
        "confidence": 2
      },
      {
        "time": 12.114,
        "confidence": 1
      },
      {
        "time": 12.435,
        "confidence": 2
      },
      {
        "time": 12.952,
        "confidence": 2
      },
      {
        "time": 13.424,
        "confidence": 2
      },
      {
        "time": 13.923,
        "confidence": 2
      },
      {
        "time": 14.444,
        "confidence": 1
      },
      {
        "time": 14.878,
        "confidence": 1
      },
      {
        "time": 15.929,
        "confidence": 1
      },
      {
        "time": 16.266,
        "confidence": 1
      },
      {
        "time": 16.476,
        "confidence": 1
      },
      {
        "time": 16.847,
        "confidence": 2
      },
      {
        "time": 17.316,
        "confidence": 2
      },
      {
        "time": 17.764,
        "confidence": 2
      },
      {
        "time": 18.201,
        "confidence": 2
      },
      {
        "time": 18.628,
        "confidence": 1
      },
      {
        "time": 19.115,
        "confidence": 1
      },
      {
        "time": 19.548,
        "confidence": 2
      },
      {
        "time": 20.061,
        "confidence": 2
      },
      {
        "time": 20.523,
        "confidence": 2
      },
      {
        "time": 20.923,
        "confidence": 1
      },
      {
        "time": 21.095,
        "confidence": 1
      },
      {
        "time": 21.391,
        "confidence": 1
      },
      {
        "time": 21.591,
        "confidence": 1
      },
      {
        "time": 21.759,
        "confidence": 1
      },
      {
        "time": 22.005,
        "confidence": 1
      },
      {
        "time": 22.281,
        "confidence": 1
      },
      {
        "time": 22.59,
        "confidence": 1
      },
      {
        "time": 22.776,
        "confidence": 1
      },
      {
        "time": 23.177,
        "confidence": 2
      },
      {
        "time": 23.498,
        "confidence": 1
      },
      {
        "time": 23.694,
        "confidence": 1
      },
      {
        "time": 24.162,
        "confidence": 1
      },
      {
        "time": 24.665,
        "confidence": 1
      },
      {
        "time": 25.134,
        "confidence": 1
      },
      {
        "time": 25.628,
        "confidence": 1
      },
      {
        "time": 26.124,
        "confidence": 1
      },
      {
        "time": 26.652,
        "confidence": 2
      },
      {
        "time": 27.132,
        "confidence": 2
      },
      {
        "time": 27.572,
        "confidence": 1
      },
      {
        "time": 28.094,
        "confidence": 1
      },
      {
        "time": 28.562,
        "confidence": 1
      },
      {
        "time": 29.011,
        "confidence": 1
      },
      {
        "time": 30.535,
        "confidence": 1
      },
      {
        "time": 30.938,
        "confidence": 2
      },
      {
        "time": 31.367,
        "confidence": 2
      },
      {
        "time": 31.828,
        "confidence": 1
      },
      {
        "time": 32.009,
        "confidence": 1
      },
      {
        "time": 32.347,
        "confidence": 2
      },
      {
        "time": 32.755,
        "confidence": 2
      },
      {
        "time": 33.201,
        "confidence": 2
      },
      {
        "time": 33.647,
        "confidence": 1
      },
      {
        "time": 34.115,
        "confidence": 1
      },
      {
        "time": 34.587,
        "confidence": 2
      },
      {
        "time": 35.052,
        "confidence": 2
      },
      {
        "time": 35.519,
        "confidence": 2
      },
      {
        "time": 35.992,
        "confidence": 2
      },
      {
        "time": 36.409,
        "confidence": 2
      },
      {
        "time": 36.859,
        "confidence": 1
      },
      {
        "time": 37.354,
        "confidence": 1
      },
      {
        "time": 37.803,
        "confidence": 1
      },
      {
        "time": 38.057,
        "confidence": 1
      },
      {
        "time": 38.299,
        "confidence": 1
      },
      {
        "time": 38.453,
        "confidence": 1
      },
      {
        "time": 38.788,
        "confidence": 2
      },
      {
        "time": 39.262,
        "confidence": 2
      },
      {
        "time": 39.495,
        "confidence": 1
      },
      {
        "time": 39.865,
        "confidence": 1
      },
      {
        "time": 40.079,
        "confidence": 1
      },
      {
        "time": 40.287,
        "confidence": 1
      },
      {
        "time": 40.602,
        "confidence": 1
      },
      {
        "time": 41.151,
        "confidence": 1
      },
      {
        "time": 41.669,
        "confidence": 2
      },
      {
        "time": 42.157,
        "confidence": 2
      },
      {
        "time": 42.615,
        "confidence": 2
      },
      {
        "time": 43.021,
        "confidence": 1
      },
      {
        "time": 43.178,
        "confidence": 1
      },
      {
        "time": 43.558,
        "confidence": 2
      },
      {
        "time": 43.974,
        "confidence": 2
      },
      {
        "time": 44.45,
        "confidence": 2
      },
      {
        "time": 44.98,
        "confidence": 2
      },
      {
        "time": 45.404,
        "confidence": 2
      },
      {
        "time": 45.903,
        "confidence": 2
      },
      {
        "time": 46.391,
        "confidence": 2
      },
      {
        "time": 46.843,
        "confidence": 2
      },
      {
        "time": 47.329,
        "confidence": 2
      },
      {
        "time": 47.778,
        "confidence": 2
      },
      {
        "time": 48.246,
        "confidence": 2
      },
      {
        "time": 48.707,
        "confidence": 2
      },
      {
        "time": 49.2,
        "confidence": 2
      },
      {
        "time": 49.682,
        "confidence": 2
      },
      {
        "time": 50.103,
        "confidence": 1
      },
      {
        "time": 50.33,
        "confidence": 1
      },
      {
        "time": 50.655,
        "confidence": 2
      },
      {
        "time": 51.108,
        "confidence": 2
      },
      {
        "time": 51.585,
        "confidence": 2
      },
      {
        "time": 52.031,
        "confidence": 2
      },
      {
        "time": 52.479,
        "confidence": 1
      },
      {
        "time": 52.939,
        "confidence": 1
      },
      {
        "time": 53.488,
        "confidence": 2
      },
      {
        "time": 53.906,
        "confidence": 2
      },
      {
        "time": 54.392,
        "confidence": 2
      },
      {
        "time": 54.809,
        "confidence": 1
      },
      {
        "time": 54.974,
        "confidence": 1
      },
      {
        "time": 55.303,
        "confidence": 2
      },
      {
        "time": 55.743,
        "confidence": 2
      },
      {
        "time": 56.224,
        "confidence": 2
      },
      {
        "time": 56.702,
        "confidence": 2
      },
      {
        "time": 57.206,
        "confidence": 2
      },
      {
        "time": 57.651,
        "confidence": 2
      },
      {
        "time": 58.104,
        "confidence": 2
      },
      {
        "time": 58.631,
        "confidence": 2
      },
      {
        "time": 59.055,
        "confidence": 2
      },
      {
        "time": 59.501,
        "confidence": 1
      },
      {
        "time": 59.704,
        "confidence": 1
      },
      {
        "time": 59.99,
        "confidence": 2
      },
      {
        "time": 60.462,
        "confidence": 2
      },
      {
        "time": 60.953,
        "confidence": 2
      },
      {
        "time": 61.393,
        "confidence": 2
      },
      {
        "time": 61.853,
        "confidence": 2
      },
      {
        "time": 62.329,
        "confidence": 2
      },
      {
        "time": 62.828,
        "confidence": 2
      },
      {
        "time": 63.206,
        "confidence": 1
      },
      {
        "time": 63.368,
        "confidence": 1
      },
      {
        "time": 63.765,
        "confidence": 2
      },
      {
        "time": 64.246,
        "confidence": 2
      },
      {
        "time": 64.654,
        "confidence": 1
      },
      {
        "time": 64.807,
        "confidence": 1
      },
      {
        "time": 65.177,
        "confidence": 2
      },
      {
        "time": 65.636,
        "confidence": 2
      },
      {
        "time": 66.128,
        "confidence": 2
      },
      {
        "time": 66.563,
        "confidence": 2
      },
      {
        "time": 67.018,
        "confidence": 2
      },
      {
        "time": 67.489,
        "confidence": 2
      },
      {
        "time": 67.949,
        "confidence": 2
      },
      {
        "time": 68.444,
        "confidence": 2
      },
      {
        "time": 68.903,
        "confidence": 2
      },
      {
        "time": 69.379,
        "confidence": 2
      },
      {
        "time": 69.825,
        "confidence": 2
      },
      {
        "time": 70.35,
        "confidence": 1
      },
      {
        "time": 70.739,
        "confidence": 2
      },
      {
        "time": 71.174,
        "confidence": 2
      },
      {
        "time": 71.66,
        "confidence": 2
      },
      {
        "time": 72.123,
        "confidence": 1
      },
      {
        "time": 72.323,
        "confidence": 1
      },
      {
        "time": 72.641,
        "confidence": 2
      },
      {
        "time": 73.106,
        "confidence": 2
      },
      {
        "time": 73.55,
        "confidence": 2
      },
      {
        "time": 74,
        "confidence": 2
      },
      {
        "time": 74.487,
        "confidence": 2
      },
      {
        "time": 74.92,
        "confidence": 2
      },
      {
        "time": 75.389,
        "confidence": 1
      },
      {
        "time": 76.425,
        "confidence": 1
      },
      {
        "time": 76.828,
        "confidence": 1
      },
      {
        "time": 77.297,
        "confidence": 1
      },
      {
        "time": 77.773,
        "confidence": 1
      },
      {
        "time": 78.222,
        "confidence": 1
      },
      {
        "time": 78.675,
        "confidence": 1
      },
      {
        "time": 79.174,
        "confidence": 2
      },
      {
        "time": 79.63,
        "confidence": 2
      },
      {
        "time": 80.068,
        "confidence": 1
      },
      {
        "time": 80.525,
        "confidence": 1
      },
      {
        "time": 80.996,
        "confidence": 1
      },
      {
        "time": 81.407,
        "confidence": 1
      },
      {
        "time": 81.894,
        "confidence": 1
      },
      {
        "time": 82.417,
        "confidence": 1
      },
      {
        "time": 83.02,
        "confidence": 1
      },
      {
        "time": 83.274,
        "confidence": 1
      },
      {
        "time": 83.442,
        "confidence": 1
      },
      {
        "time": 83.65,
        "confidence": 1
      },
      {
        "time": 83.876,
        "confidence": 1
      },
      {
        "time": 84.048,
        "confidence": 1
      },
      {
        "time": 84.306,
        "confidence": 1
      },
      {
        "time": 84.747,
        "confidence": 1
      },
      {
        "time": 85.215,
        "confidence": 1
      },
      {
        "time": 85.71,
        "confidence": 1
      },
      {
        "time": 86.186,
        "confidence": 1
      },
      {
        "time": 86.683,
        "confidence": 2
      },
      {
        "time": 87.114,
        "confidence": 2
      },
      {
        "time": 87.591,
        "confidence": 1
      },
      {
        "time": 88.048,
        "confidence": 1
      },
      {
        "time": 88.508,
        "confidence": 1
      },
      {
        "time": 88.949,
        "confidence": 1
      },
      {
        "time": 89.452,
        "confidence": 1
      },
      {
        "time": 89.948,
        "confidence": 1
      },
      {
        "time": 90.405,
        "confidence": 1
      },
      {
        "time": 90.919,
        "confidence": 1
      }
    ],
    "longPlates": [
      {
        "start": 0.949,
        "end": 1.165,
        "confidence": 2
      },
      {
        "start": 7.219,
        "end": 8.025,
        "confidence": 2
      },
      {
        "start": 10.436,
        "end": 11.007,
        "confidence": 2
      },
      {
        "start": 14.962,
        "end": 15.97,
        "confidence": 2
      },
      {
        "start": 18.785,
        "end": 19.214,
        "confidence": 1
      },
      {
        "start": 23.912,
        "end": 26.088,
        "confidence": 1
      },
      {
        "start": 28.531,
        "end": 30.408,
        "confidence": 2
      },
      {
        "start": 34.161,
        "end": 34.361,
        "confidence": 1
      },
      {
        "start": 36.943,
        "end": 37.527,
        "confidence": 1
      },
      {
        "start": 40.728,
        "end": 40.929,
        "confidence": 1
      },
      {
        "start": 52.793,
        "end": 53.003,
        "confidence": 2
      },
      {
        "start": 70.225,
        "end": 70.433,
        "confidence": 1
      },
      {
        "start": 75.609,
        "end": 76.362,
        "confidence": 2
      },
      {
        "start": 76.812,
        "end": 78.882,
        "confidence": 1
      },
      {
        "start": 80.274,
        "end": 81.5,
        "confidence": 2
      },
      {
        "start": 84.354,
        "end": 86.296,
        "confidence": 1
      },
      {
        "start": 87.655,
        "end": 92.433,
        "confidence": 1
      }
    ]
  }
};
})(window.TH = window.TH || {});
