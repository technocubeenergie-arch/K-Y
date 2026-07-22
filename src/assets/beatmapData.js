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
        0,
        1.291,
        1.798,
        2.363,
        2.796,
        3.172,
        3.659,
        4.657,
        5.134,
        5.722,
        6.179,
        6.593,
        6.96,
        7.386,
        8.044,
        8.481,
        8.887,
        9.302,
        9.77,
        10.211,
        10.696,
        11.705,
        12.135,
        12.549,
        12.971,
        13.385,
        13.826,
        14.314,
        15.707,
        16.14,
        16.57,
        17.003,
        17.409,
        17.812,
        18.218,
        18.632,
        19.514,
        19.956,
        20.424,
        20.873,
        21.387,
        21.836,
        22.386,
        22.978,
        23.384,
        26.624,
        27.053,
        30.42,
        30.908,
        31.33,
        31.771,
        32.29,
        32.742,
        33.202,
        34.154,
        34.624,
        35.134,
        35.559,
        36.016,
        36.43,
        36.883,
        37.944,
        38.393,
        38.826,
        39.275,
        39.723,
        40.184,
        40.579,
        41.802,
        42.189,
        42.611,
        43.083,
        43.575,
        44.027,
        44.422,
        44.835,
        45.366,
        45.861,
        46.364,
        46.814,
        47.518,
        47.912,
        48.319,
        48.795,
        49.225,
        49.732,
        50.153,
        50.602,
        51.035,
        51.504,
        51.934,
        52.44,
        52.924,
        53.393,
        53.85,
        54.302,
        54.813,
        55.416,
        55.885,
        56.388,
        56.848,
        57.344,
        57.738,
        58.28,
        58.702,
        59.124,
        59.546,
        59.998,
        60.428,
        60.897,
        61.365,
        61.833,
        62.309,
        62.851,
        63.288,
        63.741,
        64.217,
        64.693,
        65.126,
        65.622,
        66.09,
        66.547,
        67.034,
        67.672,
        68.114,
        68.555,
        69.124,
        69.58,
        69.994,
        70.443,
        70.893,
        71.307,
        71.759,
        72.235,
        72.665,
        73.091,
        73.548,
        74,
        74.449,
        74.898,
        75.42,
        75.897,
        79.155,
        79.585,
        82.944,
        83.374,
        86.659,
        87.073
      ],
      "longPlates": [
        {
          "start": 0.258,
          "end": 1.013
        },
        {
          "start": 2.363,
          "end": 2.851
        },
        {
          "start": 0.211,
          "end": 0.85
        },
        {
          "start": 23.806,
          "end": 26.299
        },
        {
          "start": 27.514,
          "end": 30.06
        },
        {
          "start": 76.357,
          "end": 78.884
        },
        {
          "start": 80.053,
          "end": 82.673
        },
        {
          "start": 83.88,
          "end": 86.361
        },
        {
          "start": 87.568,
          "end": 90.25
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
        "time": 1.291,
        "confidence": 1
      },
      {
        "time": 1.798,
        "confidence": 1
      },
      {
        "time": 2.363,
        "confidence": 1
      },
      {
        "time": 2.796,
        "confidence": 1
      },
      {
        "time": 3.172,
        "confidence": 1
      },
      {
        "time": 3.659,
        "confidence": 1
      },
      {
        "time": 4.657,
        "confidence": 1
      },
      {
        "time": 5.134,
        "confidence": 1
      },
      {
        "time": 5.722,
        "confidence": 1
      },
      {
        "time": 6.179,
        "confidence": 1
      },
      {
        "time": 6.593,
        "confidence": 1
      },
      {
        "time": 6.96,
        "confidence": 1
      },
      {
        "time": 7.386,
        "confidence": 1
      },
      {
        "time": 8.044,
        "confidence": 1
      },
      {
        "time": 8.481,
        "confidence": 1
      },
      {
        "time": 8.887,
        "confidence": 1
      },
      {
        "time": 9.302,
        "confidence": 1
      },
      {
        "time": 9.77,
        "confidence": 1
      },
      {
        "time": 10.211,
        "confidence": 1
      },
      {
        "time": 10.696,
        "confidence": 1
      },
      {
        "time": 11.705,
        "confidence": 1
      },
      {
        "time": 12.135,
        "confidence": 1
      },
      {
        "time": 12.549,
        "confidence": 1
      },
      {
        "time": 12.971,
        "confidence": 1
      },
      {
        "time": 13.385,
        "confidence": 1
      },
      {
        "time": 13.826,
        "confidence": 1
      },
      {
        "time": 14.314,
        "confidence": 1
      },
      {
        "time": 15.707,
        "confidence": 1
      },
      {
        "time": 16.14,
        "confidence": 1
      },
      {
        "time": 16.57,
        "confidence": 1
      },
      {
        "time": 17.003,
        "confidence": 1
      },
      {
        "time": 17.409,
        "confidence": 1
      },
      {
        "time": 17.812,
        "confidence": 1
      },
      {
        "time": 18.218,
        "confidence": 1
      },
      {
        "time": 18.632,
        "confidence": 1
      },
      {
        "time": 19.514,
        "confidence": 1
      },
      {
        "time": 19.956,
        "confidence": 1
      },
      {
        "time": 20.424,
        "confidence": 1
      },
      {
        "time": 20.873,
        "confidence": 1
      },
      {
        "time": 21.387,
        "confidence": 1
      },
      {
        "time": 21.836,
        "confidence": 1
      },
      {
        "time": 22.386,
        "confidence": 1
      },
      {
        "time": 22.978,
        "confidence": 1
      },
      {
        "time": 23.384,
        "confidence": 1
      },
      {
        "time": 26.624,
        "confidence": 1
      },
      {
        "time": 27.053,
        "confidence": 1
      },
      {
        "time": 30.42,
        "confidence": 1
      },
      {
        "time": 30.908,
        "confidence": 1
      },
      {
        "time": 31.33,
        "confidence": 1
      },
      {
        "time": 31.771,
        "confidence": 1
      },
      {
        "time": 32.29,
        "confidence": 1
      },
      {
        "time": 32.742,
        "confidence": 1
      },
      {
        "time": 33.202,
        "confidence": 1
      },
      {
        "time": 34.154,
        "confidence": 1
      },
      {
        "time": 34.624,
        "confidence": 1
      },
      {
        "time": 35.134,
        "confidence": 1
      },
      {
        "time": 35.559,
        "confidence": 1
      },
      {
        "time": 36.016,
        "confidence": 1
      },
      {
        "time": 36.43,
        "confidence": 1
      },
      {
        "time": 36.883,
        "confidence": 1
      },
      {
        "time": 37.944,
        "confidence": 1
      },
      {
        "time": 38.393,
        "confidence": 1
      },
      {
        "time": 38.826,
        "confidence": 1
      },
      {
        "time": 39.275,
        "confidence": 1
      },
      {
        "time": 39.723,
        "confidence": 1
      },
      {
        "time": 40.184,
        "confidence": 1
      },
      {
        "time": 40.579,
        "confidence": 1
      },
      {
        "time": 41.802,
        "confidence": 1
      },
      {
        "time": 42.189,
        "confidence": 1
      },
      {
        "time": 42.611,
        "confidence": 1
      },
      {
        "time": 43.083,
        "confidence": 1
      },
      {
        "time": 43.575,
        "confidence": 1
      },
      {
        "time": 44.027,
        "confidence": 1
      },
      {
        "time": 44.422,
        "confidence": 1
      },
      {
        "time": 44.835,
        "confidence": 1
      },
      {
        "time": 45.366,
        "confidence": 1
      },
      {
        "time": 45.861,
        "confidence": 1
      },
      {
        "time": 46.364,
        "confidence": 1
      },
      {
        "time": 46.814,
        "confidence": 1
      },
      {
        "time": 47.518,
        "confidence": 1
      },
      {
        "time": 47.912,
        "confidence": 1
      },
      {
        "time": 48.319,
        "confidence": 1
      },
      {
        "time": 48.795,
        "confidence": 1
      },
      {
        "time": 49.225,
        "confidence": 1
      },
      {
        "time": 49.732,
        "confidence": 1
      },
      {
        "time": 50.153,
        "confidence": 1
      },
      {
        "time": 50.602,
        "confidence": 1
      },
      {
        "time": 51.035,
        "confidence": 1
      },
      {
        "time": 51.504,
        "confidence": 1
      },
      {
        "time": 51.934,
        "confidence": 1
      },
      {
        "time": 52.44,
        "confidence": 1
      },
      {
        "time": 52.924,
        "confidence": 1
      },
      {
        "time": 53.393,
        "confidence": 1
      },
      {
        "time": 53.85,
        "confidence": 1
      },
      {
        "time": 54.302,
        "confidence": 1
      },
      {
        "time": 54.813,
        "confidence": 1
      },
      {
        "time": 55.416,
        "confidence": 1
      },
      {
        "time": 55.885,
        "confidence": 1
      },
      {
        "time": 56.388,
        "confidence": 1
      },
      {
        "time": 56.848,
        "confidence": 1
      },
      {
        "time": 57.344,
        "confidence": 1
      },
      {
        "time": 57.738,
        "confidence": 1
      },
      {
        "time": 58.28,
        "confidence": 1
      },
      {
        "time": 58.702,
        "confidence": 1
      },
      {
        "time": 59.124,
        "confidence": 1
      },
      {
        "time": 59.546,
        "confidence": 1
      },
      {
        "time": 59.998,
        "confidence": 1
      },
      {
        "time": 60.428,
        "confidence": 1
      },
      {
        "time": 60.897,
        "confidence": 1
      },
      {
        "time": 61.365,
        "confidence": 1
      },
      {
        "time": 61.833,
        "confidence": 1
      },
      {
        "time": 62.309,
        "confidence": 1
      },
      {
        "time": 62.851,
        "confidence": 1
      },
      {
        "time": 63.288,
        "confidence": 1
      },
      {
        "time": 63.741,
        "confidence": 1
      },
      {
        "time": 64.217,
        "confidence": 1
      },
      {
        "time": 64.693,
        "confidence": 1
      },
      {
        "time": 65.126,
        "confidence": 1
      },
      {
        "time": 65.622,
        "confidence": 1
      },
      {
        "time": 66.09,
        "confidence": 1
      },
      {
        "time": 66.547,
        "confidence": 1
      },
      {
        "time": 67.034,
        "confidence": 1
      },
      {
        "time": 67.672,
        "confidence": 1
      },
      {
        "time": 68.114,
        "confidence": 1
      },
      {
        "time": 68.555,
        "confidence": 1
      },
      {
        "time": 69.124,
        "confidence": 1
      },
      {
        "time": 69.58,
        "confidence": 1
      },
      {
        "time": 69.994,
        "confidence": 1
      },
      {
        "time": 70.443,
        "confidence": 1
      },
      {
        "time": 70.893,
        "confidence": 1
      },
      {
        "time": 71.307,
        "confidence": 1
      },
      {
        "time": 71.759,
        "confidence": 1
      },
      {
        "time": 72.235,
        "confidence": 1
      },
      {
        "time": 72.665,
        "confidence": 1
      },
      {
        "time": 73.091,
        "confidence": 1
      },
      {
        "time": 73.548,
        "confidence": 1
      },
      {
        "time": 74,
        "confidence": 1
      },
      {
        "time": 74.449,
        "confidence": 1
      },
      {
        "time": 74.898,
        "confidence": 1
      },
      {
        "time": 75.42,
        "confidence": 1
      },
      {
        "time": 75.897,
        "confidence": 1
      },
      {
        "time": 79.155,
        "confidence": 1
      },
      {
        "time": 79.585,
        "confidence": 1
      },
      {
        "time": 82.944,
        "confidence": 1
      },
      {
        "time": 83.374,
        "confidence": 1
      },
      {
        "time": 86.659,
        "confidence": 1
      },
      {
        "time": 87.073,
        "confidence": 1
      }
    ],
    "longPlates": [
      {
        "start": 0.235,
        "end": 0.932,
        "confidence": 2
      },
      {
        "start": 2.363,
        "end": 2.851,
        "confidence": 1
      },
      {
        "start": 23.806,
        "end": 26.299,
        "confidence": 1
      },
      {
        "start": 27.514,
        "end": 30.06,
        "confidence": 1
      },
      {
        "start": 76.357,
        "end": 78.884,
        "confidence": 1
      },
      {
        "start": 80.053,
        "end": 82.673,
        "confidence": 1
      },
      {
        "start": 83.88,
        "end": 86.361,
        "confidence": 1
      },
      {
        "start": 87.568,
        "end": 90.25,
        "confidence": 1
      }
    ]
  }
};
})(window.TH = window.TH || {});
