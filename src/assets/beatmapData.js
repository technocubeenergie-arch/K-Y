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
        1.272,
        1.883,
        2.325,
        2.766,
        3.242,
        3.71,
        4.655,
        5.165,
        5.645,
        6.094,
        6.554,
        6.976,
        7.445,
        7.948,
        8.416,
        8.873,
        9.352,
        9.793,
        10.277,
        10.719,
        11.655,
        12.077,
        12.51,
        12.967,
        13.42,
        13.888,
        14.337,
        15.436,
        15.614,
        15.839,
        16.172,
        16.605,
        17.061,
        17.495,
        17.928,
        18.35,
        19.279,
        19.546,
        19.797,
        20.158,
        20.591,
        21.067,
        21.481,
        21.923,
        22.371,
        22.777,
        23.226,
        23.66,
        24.082,
        24.504,
        24.956,
        25.487,
        25.854,
        26.295,
        26.736,
        27.143,
        27.565,
        27.967,
        28.408,
        28.807,
        29.248,
        29.678,
        30.111,
        30.544,
        30.982,
        31.408,
        31.829,
        32.224,
        32.685,
        33.099,
        33.501,
        33.927,
        34.341,
        34.763,
        35.166,
        35.618,
        36.048,
        36.462,
        36.895,
        37.31,
        37.75,
        38.184,
        38.606,
        39.02,
        39.388,
        39.596,
        39.782,
        40.316,
        40.495,
        40.665,
        40.838,
        40.998,
        41.152,
        41.558,
        42.007,
        42.421,
        42.863,
        43.304,
        43.699,
        44.129,
        44.481,
        44.902,
        45.263,
        45.661,
        46.055,
        46.416,
        46.783,
        47.17,
        47.514,
        47.882,
        48.261,
        48.675,
        49.132,
        49.511,
        49.898,
        50.293,
        50.688,
        51.059,
        51.427,
        51.86,
        52.274,
        52.661,
        53.045,
        53.416,
        53.811,
        54.19,
        54.577,
        54.972,
        55.413,
        55.838,
        56.214,
        56.567,
        57.008,
        57.402,
        57.743,
        58.095,
        58.699,
        59.047,
        59.392,
        59.751,
        60.057,
        60.406,
        60.757,
        61.145,
        61.551,
        61.911,
        62.279,
        62.658,
        63.037,
        63.397,
        63.784,
        64.178,
        64.592,
        64.961,
        65.348,
        65.719,
        66.129,
        66.52,
        66.895,
        67.201,
        67.607,
        67.994,
        68.389,
        68.757,
        69.129,
        69.542,
        69.891,
        70.27,
        70.665,
        71.036,
        71.349,
        71.737,
        72.104,
        72.492,
        72.789,
        73.509,
        73.904,
        74.275,
        74.651,
        75.046,
        75.39,
        75.758,
        76.11,
        76.497,
        76.857,
        77.236,
        77.631,
        77.99,
        78.358,
        78.718,
        79.051,
        79.403,
        80.383,
        80.762,
        81.122,
        81.509,
        81.958,
        82.437,
        83.021,
        83.416,
        83.83,
        84.287,
        84.767,
        85.2,
        85.622,
        86.501,
        86.907,
        87.294,
        87.654,
        88.06,
        88.463,
        88.951,
        89.373,
        89.759
      ],
      "longPlates": [
        {
          "start": 39.956,
          "end": 40.223
        }
      ]
    }
  ],
  "merged": {
    "tiles": [
      {
        "time": 1.272,
        "confidence": 1
      },
      {
        "time": 1.883,
        "confidence": 1
      },
      {
        "time": 2.325,
        "confidence": 1
      },
      {
        "time": 2.766,
        "confidence": 1
      },
      {
        "time": 3.242,
        "confidence": 1
      },
      {
        "time": 3.71,
        "confidence": 1
      },
      {
        "time": 4.655,
        "confidence": 1
      },
      {
        "time": 5.165,
        "confidence": 1
      },
      {
        "time": 5.645,
        "confidence": 1
      },
      {
        "time": 6.094,
        "confidence": 1
      },
      {
        "time": 6.554,
        "confidence": 1
      },
      {
        "time": 6.976,
        "confidence": 1
      },
      {
        "time": 7.445,
        "confidence": 1
      },
      {
        "time": 7.948,
        "confidence": 1
      },
      {
        "time": 8.416,
        "confidence": 1
      },
      {
        "time": 8.873,
        "confidence": 1
      },
      {
        "time": 9.352,
        "confidence": 1
      },
      {
        "time": 9.793,
        "confidence": 1
      },
      {
        "time": 10.277,
        "confidence": 1
      },
      {
        "time": 10.719,
        "confidence": 1
      },
      {
        "time": 11.655,
        "confidence": 1
      },
      {
        "time": 12.077,
        "confidence": 1
      },
      {
        "time": 12.51,
        "confidence": 1
      },
      {
        "time": 12.967,
        "confidence": 1
      },
      {
        "time": 13.42,
        "confidence": 1
      },
      {
        "time": 13.888,
        "confidence": 1
      },
      {
        "time": 14.337,
        "confidence": 1
      },
      {
        "time": 15.436,
        "confidence": 1
      },
      {
        "time": 15.614,
        "confidence": 1
      },
      {
        "time": 15.839,
        "confidence": 1
      },
      {
        "time": 16.172,
        "confidence": 1
      },
      {
        "time": 16.605,
        "confidence": 1
      },
      {
        "time": 17.061,
        "confidence": 1
      },
      {
        "time": 17.495,
        "confidence": 1
      },
      {
        "time": 17.928,
        "confidence": 1
      },
      {
        "time": 18.35,
        "confidence": 1
      },
      {
        "time": 19.279,
        "confidence": 1
      },
      {
        "time": 19.546,
        "confidence": 1
      },
      {
        "time": 19.797,
        "confidence": 1
      },
      {
        "time": 20.158,
        "confidence": 1
      },
      {
        "time": 20.591,
        "confidence": 1
      },
      {
        "time": 21.067,
        "confidence": 1
      },
      {
        "time": 21.481,
        "confidence": 1
      },
      {
        "time": 21.923,
        "confidence": 1
      },
      {
        "time": 22.371,
        "confidence": 1
      },
      {
        "time": 22.777,
        "confidence": 1
      },
      {
        "time": 23.226,
        "confidence": 1
      },
      {
        "time": 23.66,
        "confidence": 1
      },
      {
        "time": 24.082,
        "confidence": 1
      },
      {
        "time": 24.504,
        "confidence": 1
      },
      {
        "time": 24.956,
        "confidence": 1
      },
      {
        "time": 25.487,
        "confidence": 1
      },
      {
        "time": 25.854,
        "confidence": 1
      },
      {
        "time": 26.295,
        "confidence": 1
      },
      {
        "time": 26.736,
        "confidence": 1
      },
      {
        "time": 27.143,
        "confidence": 1
      },
      {
        "time": 27.565,
        "confidence": 1
      },
      {
        "time": 27.967,
        "confidence": 1
      },
      {
        "time": 28.408,
        "confidence": 1
      },
      {
        "time": 28.807,
        "confidence": 1
      },
      {
        "time": 29.248,
        "confidence": 1
      },
      {
        "time": 29.678,
        "confidence": 1
      },
      {
        "time": 30.111,
        "confidence": 1
      },
      {
        "time": 30.544,
        "confidence": 1
      },
      {
        "time": 30.982,
        "confidence": 1
      },
      {
        "time": 31.408,
        "confidence": 1
      },
      {
        "time": 31.829,
        "confidence": 1
      },
      {
        "time": 32.224,
        "confidence": 1
      },
      {
        "time": 32.685,
        "confidence": 1
      },
      {
        "time": 33.099,
        "confidence": 1
      },
      {
        "time": 33.501,
        "confidence": 1
      },
      {
        "time": 33.927,
        "confidence": 1
      },
      {
        "time": 34.341,
        "confidence": 1
      },
      {
        "time": 34.763,
        "confidence": 1
      },
      {
        "time": 35.166,
        "confidence": 1
      },
      {
        "time": 35.618,
        "confidence": 1
      },
      {
        "time": 36.048,
        "confidence": 1
      },
      {
        "time": 36.462,
        "confidence": 1
      },
      {
        "time": 36.895,
        "confidence": 1
      },
      {
        "time": 37.31,
        "confidence": 1
      },
      {
        "time": 37.75,
        "confidence": 1
      },
      {
        "time": 38.184,
        "confidence": 1
      },
      {
        "time": 38.606,
        "confidence": 1
      },
      {
        "time": 39.02,
        "confidence": 1
      },
      {
        "time": 39.388,
        "confidence": 1
      },
      {
        "time": 39.596,
        "confidence": 1
      },
      {
        "time": 39.782,
        "confidence": 1
      },
      {
        "time": 40.316,
        "confidence": 1
      },
      {
        "time": 40.495,
        "confidence": 1
      },
      {
        "time": 40.665,
        "confidence": 1
      },
      {
        "time": 40.838,
        "confidence": 1
      },
      {
        "time": 40.998,
        "confidence": 1
      },
      {
        "time": 41.152,
        "confidence": 1
      },
      {
        "time": 41.558,
        "confidence": 1
      },
      {
        "time": 42.007,
        "confidence": 1
      },
      {
        "time": 42.421,
        "confidence": 1
      },
      {
        "time": 42.863,
        "confidence": 1
      },
      {
        "time": 43.304,
        "confidence": 1
      },
      {
        "time": 43.699,
        "confidence": 1
      },
      {
        "time": 44.129,
        "confidence": 1
      },
      {
        "time": 44.481,
        "confidence": 1
      },
      {
        "time": 44.902,
        "confidence": 1
      },
      {
        "time": 45.263,
        "confidence": 1
      },
      {
        "time": 45.661,
        "confidence": 1
      },
      {
        "time": 46.055,
        "confidence": 1
      },
      {
        "time": 46.416,
        "confidence": 1
      },
      {
        "time": 46.783,
        "confidence": 1
      },
      {
        "time": 47.17,
        "confidence": 1
      },
      {
        "time": 47.514,
        "confidence": 1
      },
      {
        "time": 47.882,
        "confidence": 1
      },
      {
        "time": 48.261,
        "confidence": 1
      },
      {
        "time": 48.675,
        "confidence": 1
      },
      {
        "time": 49.132,
        "confidence": 1
      },
      {
        "time": 49.511,
        "confidence": 1
      },
      {
        "time": 49.898,
        "confidence": 1
      },
      {
        "time": 50.293,
        "confidence": 1
      },
      {
        "time": 50.688,
        "confidence": 1
      },
      {
        "time": 51.059,
        "confidence": 1
      },
      {
        "time": 51.427,
        "confidence": 1
      },
      {
        "time": 51.86,
        "confidence": 1
      },
      {
        "time": 52.274,
        "confidence": 1
      },
      {
        "time": 52.661,
        "confidence": 1
      },
      {
        "time": 53.045,
        "confidence": 1
      },
      {
        "time": 53.416,
        "confidence": 1
      },
      {
        "time": 53.811,
        "confidence": 1
      },
      {
        "time": 54.19,
        "confidence": 1
      },
      {
        "time": 54.577,
        "confidence": 1
      },
      {
        "time": 54.972,
        "confidence": 1
      },
      {
        "time": 55.413,
        "confidence": 1
      },
      {
        "time": 55.838,
        "confidence": 1
      },
      {
        "time": 56.214,
        "confidence": 1
      },
      {
        "time": 56.567,
        "confidence": 1
      },
      {
        "time": 57.008,
        "confidence": 1
      },
      {
        "time": 57.402,
        "confidence": 1
      },
      {
        "time": 57.743,
        "confidence": 1
      },
      {
        "time": 58.095,
        "confidence": 1
      },
      {
        "time": 58.699,
        "confidence": 1
      },
      {
        "time": 59.047,
        "confidence": 1
      },
      {
        "time": 59.392,
        "confidence": 1
      },
      {
        "time": 59.751,
        "confidence": 1
      },
      {
        "time": 60.057,
        "confidence": 1
      },
      {
        "time": 60.406,
        "confidence": 1
      },
      {
        "time": 60.757,
        "confidence": 1
      },
      {
        "time": 61.145,
        "confidence": 1
      },
      {
        "time": 61.551,
        "confidence": 1
      },
      {
        "time": 61.911,
        "confidence": 1
      },
      {
        "time": 62.279,
        "confidence": 1
      },
      {
        "time": 62.658,
        "confidence": 1
      },
      {
        "time": 63.037,
        "confidence": 1
      },
      {
        "time": 63.397,
        "confidence": 1
      },
      {
        "time": 63.784,
        "confidence": 1
      },
      {
        "time": 64.178,
        "confidence": 1
      },
      {
        "time": 64.592,
        "confidence": 1
      },
      {
        "time": 64.961,
        "confidence": 1
      },
      {
        "time": 65.348,
        "confidence": 1
      },
      {
        "time": 65.719,
        "confidence": 1
      },
      {
        "time": 66.129,
        "confidence": 1
      },
      {
        "time": 66.52,
        "confidence": 1
      },
      {
        "time": 66.895,
        "confidence": 1
      },
      {
        "time": 67.201,
        "confidence": 1
      },
      {
        "time": 67.607,
        "confidence": 1
      },
      {
        "time": 67.994,
        "confidence": 1
      },
      {
        "time": 68.389,
        "confidence": 1
      },
      {
        "time": 68.757,
        "confidence": 1
      },
      {
        "time": 69.129,
        "confidence": 1
      },
      {
        "time": 69.542,
        "confidence": 1
      },
      {
        "time": 69.891,
        "confidence": 1
      },
      {
        "time": 70.27,
        "confidence": 1
      },
      {
        "time": 70.665,
        "confidence": 1
      },
      {
        "time": 71.036,
        "confidence": 1
      },
      {
        "time": 71.349,
        "confidence": 1
      },
      {
        "time": 71.737,
        "confidence": 1
      },
      {
        "time": 72.104,
        "confidence": 1
      },
      {
        "time": 72.492,
        "confidence": 1
      },
      {
        "time": 72.789,
        "confidence": 1
      },
      {
        "time": 73.509,
        "confidence": 1
      },
      {
        "time": 73.904,
        "confidence": 1
      },
      {
        "time": 74.275,
        "confidence": 1
      },
      {
        "time": 74.651,
        "confidence": 1
      },
      {
        "time": 75.046,
        "confidence": 1
      },
      {
        "time": 75.39,
        "confidence": 1
      },
      {
        "time": 75.758,
        "confidence": 1
      },
      {
        "time": 76.11,
        "confidence": 1
      },
      {
        "time": 76.497,
        "confidence": 1
      },
      {
        "time": 76.857,
        "confidence": 1
      },
      {
        "time": 77.236,
        "confidence": 1
      },
      {
        "time": 77.631,
        "confidence": 1
      },
      {
        "time": 77.99,
        "confidence": 1
      },
      {
        "time": 78.358,
        "confidence": 1
      },
      {
        "time": 78.718,
        "confidence": 1
      },
      {
        "time": 79.051,
        "confidence": 1
      },
      {
        "time": 79.403,
        "confidence": 1
      },
      {
        "time": 80.383,
        "confidence": 1
      },
      {
        "time": 80.762,
        "confidence": 1
      },
      {
        "time": 81.122,
        "confidence": 1
      },
      {
        "time": 81.509,
        "confidence": 1
      },
      {
        "time": 81.958,
        "confidence": 1
      },
      {
        "time": 82.437,
        "confidence": 1
      },
      {
        "time": 83.021,
        "confidence": 1
      },
      {
        "time": 83.416,
        "confidence": 1
      },
      {
        "time": 83.83,
        "confidence": 1
      },
      {
        "time": 84.287,
        "confidence": 1
      },
      {
        "time": 84.767,
        "confidence": 1
      },
      {
        "time": 85.2,
        "confidence": 1
      },
      {
        "time": 85.622,
        "confidence": 1
      },
      {
        "time": 86.501,
        "confidence": 1
      },
      {
        "time": 86.907,
        "confidence": 1
      },
      {
        "time": 87.294,
        "confidence": 1
      },
      {
        "time": 87.654,
        "confidence": 1
      },
      {
        "time": 88.06,
        "confidence": 1
      },
      {
        "time": 88.463,
        "confidence": 1
      },
      {
        "time": 88.951,
        "confidence": 1
      },
      {
        "time": 89.373,
        "confidence": 1
      },
      {
        "time": 89.759,
        "confidence": 1
      }
    ],
    "longPlates": [
      {
        "start": 39.956,
        "end": 40.223,
        "confidence": 1
      }
    ]
  }
};
})(window.TH = window.TH || {});
