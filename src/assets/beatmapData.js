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
        0,
        1.336,
        1.769,
        1.104,
        1.634,
        2.11,
        2.659,
        3.12,
        3.615,
        4.622,
        5.09,
        5.512,
        5.953,
        6.413,
        6.843,
        7.312,
        7.853,
        8.364,
        8.805,
        9.257,
        9.769,
        10.21,
        10.713,
        11.711,
        12.172,
        12.613,
        13.043,
        13.657,
        14.041,
        14.447,
        15.879,
        16.309,
        16.769,
        17.299,
        17.784,
        18.174,
        18.623,
        19.63,
        20.089,
        20.601,
        21.104,
        21.618,
        22.068,
        22.493,
        23.302,
        26.614,
        27.072,
        30.473,
        30.906,
        31.336,
        31.785,
        32.308,
        32.768,
        33.209,
        34.1,
        34.622,
        35.09,
        35.539,
        36.042,
        36.475,
        36.905,
        38.112,
        38.538,
        38.967,
        39.409,
        39.857,
        40.291,
        40.705,
        41.676,
        42.145,
        42.602,
        43.015,
        43.585,
        44.026,
        44.447,
        44.896,
        45.392,
        45.914,
        46.382,
        46.805,
        47.3,
        47.741,
        48.217,
        48.747,
        49.189,
        49.703,
        50.152,
        50.639,
        51.096,
        51.557,
        51.97,
        52.466,
        52.95,
        53.391,
        53.851,
        54.328,
        54.769,
        55.209,
        55.64,
        56.127,
        56.642,
        57.071,
        57.54,
        57.973,
        58.349,
        58.701,
        59.069,
        59.367,
        59.881,
        60.392,
        60.86,
        62.362,
        62.884,
        63.345,
        63.767,
        64.27,
        64.73,
        65.179,
        65.62,
        66.069,
        66.494,
        66.936,
        67.439,
        67.977,
        68.399,
        68.84,
        69.292,
        69.742,
        70.191,
        70.632,
        71.1,
        71.569,
        72.045,
        72.532,
        73,
        73.503,
        73.987,
        74.483,
        74.97,
        75.481,
        75.933,
        79.099,
        79.603,
        82.962,
        83.391,
        86.595,
        87.072
      ],
      "longPlates": [
        {
          "start": 0.31,
          "end": 1.146
        },
        {
          "start": 0.283,
          "end": 0.868
        },
        {
          "start": 0.178,
          "end": 0.922
        },
        {
          "start": 23.921,
          "end": 26.243
        },
        {
          "start": 27.54,
          "end": 30.14
        },
        {
          "start": 61.336,
          "end": 61.545
        },
        {
          "start": 61.832,
          "end": 62.04
        },
        {
          "start": 76.418,
          "end": 78.778
        },
        {
          "start": 80.063,
          "end": 82.625
        },
        {
          "start": 83.868,
          "end": 86.271
        },
        {
          "start": 87.54,
          "end": 90.357
        }
      ]
    }
  ],
  "merged": {
    "tiles": [
      {
        "time": 0,
        "confidence": 2
      },
      {
        "time": 1.104,
        "confidence": 1
      },
      {
        "time": 1.336,
        "confidence": 1
      },
      {
        "time": 1.701,
        "confidence": 2
      },
      {
        "time": 2.11,
        "confidence": 1
      },
      {
        "time": 2.659,
        "confidence": 1
      },
      {
        "time": 3.12,
        "confidence": 1
      },
      {
        "time": 3.615,
        "confidence": 1
      },
      {
        "time": 4.622,
        "confidence": 1
      },
      {
        "time": 5.09,
        "confidence": 1
      },
      {
        "time": 5.512,
        "confidence": 1
      },
      {
        "time": 5.953,
        "confidence": 1
      },
      {
        "time": 6.413,
        "confidence": 1
      },
      {
        "time": 6.843,
        "confidence": 1
      },
      {
        "time": 7.312,
        "confidence": 1
      },
      {
        "time": 7.853,
        "confidence": 1
      },
      {
        "time": 8.364,
        "confidence": 1
      },
      {
        "time": 8.805,
        "confidence": 1
      },
      {
        "time": 9.257,
        "confidence": 1
      },
      {
        "time": 9.769,
        "confidence": 1
      },
      {
        "time": 10.21,
        "confidence": 1
      },
      {
        "time": 10.713,
        "confidence": 1
      },
      {
        "time": 11.711,
        "confidence": 1
      },
      {
        "time": 12.172,
        "confidence": 1
      },
      {
        "time": 12.613,
        "confidence": 1
      },
      {
        "time": 13.043,
        "confidence": 1
      },
      {
        "time": 13.657,
        "confidence": 1
      },
      {
        "time": 14.041,
        "confidence": 1
      },
      {
        "time": 14.447,
        "confidence": 1
      },
      {
        "time": 15.879,
        "confidence": 1
      },
      {
        "time": 16.309,
        "confidence": 1
      },
      {
        "time": 16.769,
        "confidence": 1
      },
      {
        "time": 17.299,
        "confidence": 1
      },
      {
        "time": 17.784,
        "confidence": 1
      },
      {
        "time": 18.174,
        "confidence": 1
      },
      {
        "time": 18.623,
        "confidence": 1
      },
      {
        "time": 19.63,
        "confidence": 1
      },
      {
        "time": 20.089,
        "confidence": 1
      },
      {
        "time": 20.601,
        "confidence": 1
      },
      {
        "time": 21.104,
        "confidence": 1
      },
      {
        "time": 21.618,
        "confidence": 1
      },
      {
        "time": 22.068,
        "confidence": 1
      },
      {
        "time": 22.493,
        "confidence": 1
      },
      {
        "time": 23.302,
        "confidence": 1
      },
      {
        "time": 26.614,
        "confidence": 1
      },
      {
        "time": 27.072,
        "confidence": 1
      },
      {
        "time": 30.473,
        "confidence": 1
      },
      {
        "time": 30.906,
        "confidence": 1
      },
      {
        "time": 31.336,
        "confidence": 1
      },
      {
        "time": 31.785,
        "confidence": 1
      },
      {
        "time": 32.308,
        "confidence": 1
      },
      {
        "time": 32.768,
        "confidence": 1
      },
      {
        "time": 33.209,
        "confidence": 1
      },
      {
        "time": 34.1,
        "confidence": 1
      },
      {
        "time": 34.622,
        "confidence": 1
      },
      {
        "time": 35.09,
        "confidence": 1
      },
      {
        "time": 35.539,
        "confidence": 1
      },
      {
        "time": 36.042,
        "confidence": 1
      },
      {
        "time": 36.475,
        "confidence": 1
      },
      {
        "time": 36.905,
        "confidence": 1
      },
      {
        "time": 38.112,
        "confidence": 1
      },
      {
        "time": 38.538,
        "confidence": 1
      },
      {
        "time": 38.967,
        "confidence": 1
      },
      {
        "time": 39.409,
        "confidence": 1
      },
      {
        "time": 39.857,
        "confidence": 1
      },
      {
        "time": 40.291,
        "confidence": 1
      },
      {
        "time": 40.705,
        "confidence": 1
      },
      {
        "time": 41.676,
        "confidence": 1
      },
      {
        "time": 42.145,
        "confidence": 1
      },
      {
        "time": 42.602,
        "confidence": 1
      },
      {
        "time": 43.015,
        "confidence": 1
      },
      {
        "time": 43.585,
        "confidence": 1
      },
      {
        "time": 44.026,
        "confidence": 1
      },
      {
        "time": 44.447,
        "confidence": 1
      },
      {
        "time": 44.896,
        "confidence": 1
      },
      {
        "time": 45.392,
        "confidence": 1
      },
      {
        "time": 45.914,
        "confidence": 1
      },
      {
        "time": 46.382,
        "confidence": 1
      },
      {
        "time": 46.805,
        "confidence": 1
      },
      {
        "time": 47.3,
        "confidence": 1
      },
      {
        "time": 47.741,
        "confidence": 1
      },
      {
        "time": 48.217,
        "confidence": 1
      },
      {
        "time": 48.747,
        "confidence": 1
      },
      {
        "time": 49.189,
        "confidence": 1
      },
      {
        "time": 49.703,
        "confidence": 1
      },
      {
        "time": 50.152,
        "confidence": 1
      },
      {
        "time": 50.639,
        "confidence": 1
      },
      {
        "time": 51.096,
        "confidence": 1
      },
      {
        "time": 51.557,
        "confidence": 1
      },
      {
        "time": 51.97,
        "confidence": 1
      },
      {
        "time": 52.466,
        "confidence": 1
      },
      {
        "time": 52.95,
        "confidence": 1
      },
      {
        "time": 53.391,
        "confidence": 1
      },
      {
        "time": 53.851,
        "confidence": 1
      },
      {
        "time": 54.328,
        "confidence": 1
      },
      {
        "time": 54.769,
        "confidence": 1
      },
      {
        "time": 55.209,
        "confidence": 1
      },
      {
        "time": 55.64,
        "confidence": 1
      },
      {
        "time": 56.127,
        "confidence": 1
      },
      {
        "time": 56.642,
        "confidence": 1
      },
      {
        "time": 57.071,
        "confidence": 1
      },
      {
        "time": 57.54,
        "confidence": 1
      },
      {
        "time": 57.973,
        "confidence": 1
      },
      {
        "time": 58.349,
        "confidence": 1
      },
      {
        "time": 58.701,
        "confidence": 1
      },
      {
        "time": 59.069,
        "confidence": 1
      },
      {
        "time": 59.367,
        "confidence": 1
      },
      {
        "time": 59.881,
        "confidence": 1
      },
      {
        "time": 60.392,
        "confidence": 1
      },
      {
        "time": 60.86,
        "confidence": 1
      },
      {
        "time": 62.362,
        "confidence": 1
      },
      {
        "time": 62.884,
        "confidence": 1
      },
      {
        "time": 63.345,
        "confidence": 1
      },
      {
        "time": 63.767,
        "confidence": 1
      },
      {
        "time": 64.27,
        "confidence": 1
      },
      {
        "time": 64.73,
        "confidence": 1
      },
      {
        "time": 65.179,
        "confidence": 1
      },
      {
        "time": 65.62,
        "confidence": 1
      },
      {
        "time": 66.069,
        "confidence": 1
      },
      {
        "time": 66.494,
        "confidence": 1
      },
      {
        "time": 66.936,
        "confidence": 1
      },
      {
        "time": 67.439,
        "confidence": 1
      },
      {
        "time": 67.977,
        "confidence": 1
      },
      {
        "time": 68.399,
        "confidence": 1
      },
      {
        "time": 68.84,
        "confidence": 1
      },
      {
        "time": 69.292,
        "confidence": 1
      },
      {
        "time": 69.742,
        "confidence": 1
      },
      {
        "time": 70.191,
        "confidence": 1
      },
      {
        "time": 70.632,
        "confidence": 1
      },
      {
        "time": 71.1,
        "confidence": 1
      },
      {
        "time": 71.569,
        "confidence": 1
      },
      {
        "time": 72.045,
        "confidence": 1
      },
      {
        "time": 72.532,
        "confidence": 1
      },
      {
        "time": 73,
        "confidence": 1
      },
      {
        "time": 73.503,
        "confidence": 1
      },
      {
        "time": 73.987,
        "confidence": 1
      },
      {
        "time": 74.483,
        "confidence": 1
      },
      {
        "time": 74.97,
        "confidence": 1
      },
      {
        "time": 75.481,
        "confidence": 1
      },
      {
        "time": 75.933,
        "confidence": 1
      },
      {
        "time": 79.099,
        "confidence": 1
      },
      {
        "time": 79.603,
        "confidence": 1
      },
      {
        "time": 82.962,
        "confidence": 1
      },
      {
        "time": 83.391,
        "confidence": 1
      },
      {
        "time": 86.595,
        "confidence": 1
      },
      {
        "time": 87.072,
        "confidence": 1
      }
    ],
    "longPlates": [
      {
        "start": 0.257,
        "end": 0.979,
        "confidence": 3
      },
      {
        "start": 23.921,
        "end": 26.243,
        "confidence": 1
      },
      {
        "start": 27.54,
        "end": 30.14,
        "confidence": 1
      },
      {
        "start": 61.584,
        "end": 61.793,
        "confidence": 2
      },
      {
        "start": 76.418,
        "end": 78.778,
        "confidence": 1
      },
      {
        "start": 80.063,
        "end": 82.625,
        "confidence": 1
      },
      {
        "start": 83.868,
        "end": 86.271,
        "confidence": 1
      },
      {
        "start": 87.54,
        "end": 90.357,
        "confidence": 1
      }
    ]
  }
};
})(window.TH = window.TH || {});
