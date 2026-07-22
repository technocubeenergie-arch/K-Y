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
        1.239,
        1.816,
        2.265,
        2.741,
        3.163,
        3.666,
        4.648,
        5.089,
        5.531,
        6.019,
        6.61,
        7.006,
        7.474,
        8.12,
        8.581,
        9.014,
        9.506,
        9.92,
        10.345,
        10.813,
        11.746,
        12.361,
        12.791,
        13.232,
        13.681,
        14.088,
        14.482,
        15.671,
        16.626,
        17.164,
        17.687,
        18.128,
        18.596,
        19.486,
        19.943,
        20.431,
        20.945,
        21.429,
        21.882,
        22.366,
        22.869,
        23.321,
        26.595,
        27.025,
        30.446,
        30.879,
        31.293,
        31.77,
        32.226,
        32.687,
        33.144,
        34.316,
        34.711,
        35.144,
        35.577,
        36.042,
        36.494,
        36.944,
        38.058,
        38.476,
        38.913,
        39.335,
        39.842,
        40.256,
        40.759,
        41.963,
        42.343,
        42.73,
        43.151,
        43.585,
        44.018,
        44.502,
        44.943,
        45.419,
        45.968,
        46.383,
        46.832,
        47.273,
        47.714,
        48.144,
        48.643,
        49.138,
        49.648,
        50.09,
        50.578,
        51.026,
        51.456,
        51.924,
        52.385,
        52.861,
        53.329,
        53.751,
        54.273,
        54.749,
        55.217,
        55.659,
        56.147,
        56.568,
        57.056,
        57.521,
        57.989,
        58.546,
        59.007,
        59.448,
        59.896,
        60.392,
        60.86,
        61.301,
        61.785,
        62.265,
        62.76,
        63.245,
        63.705,
        64.162,
        64.695,
        65.152,
        65.612,
        66.081,
        66.511,
        66.959,
        67.401,
        67.861,
        68.375,
        68.832,
        69.328,
        69.769,
        70.256,
        70.659,
        71.128,
        71.584,
        72.037,
        72.521,
        73,
        73.484,
        73.96,
        74.421,
        74.87,
        75.365,
        75.853,
        82.942,
        83.392,
        86.696,
        87.099
      ],
      "longPlates": [
        {
          "start": 0.214,
          "end": 0.825
        },
        {
          "start": 16.12,
          "end": 16.32
        },
        {
          "start": 23.817,
          "end": 26.282
        },
        {
          "start": 27.512,
          "end": 29.823
        },
        {
          "start": 76.345,
          "end": 78.732
        },
        {
          "start": 79.649,
          "end": 79.866
        },
        {
          "start": 80.09,
          "end": 82.528
        },
        {
          "start": 83.879,
          "end": 86.306
        },
        {
          "start": 87.587,
          "end": 90.276
        }
      ]
    }
  ],
  "merged": {
    "tiles": [
      {
        "time": 1.239,
        "confidence": 1
      },
      {
        "time": 1.816,
        "confidence": 1
      },
      {
        "time": 2.265,
        "confidence": 1
      },
      {
        "time": 2.741,
        "confidence": 1
      },
      {
        "time": 3.163,
        "confidence": 1
      },
      {
        "time": 3.666,
        "confidence": 1
      },
      {
        "time": 4.648,
        "confidence": 1
      },
      {
        "time": 5.089,
        "confidence": 1
      },
      {
        "time": 5.531,
        "confidence": 1
      },
      {
        "time": 6.019,
        "confidence": 1
      },
      {
        "time": 6.61,
        "confidence": 1
      },
      {
        "time": 7.006,
        "confidence": 1
      },
      {
        "time": 7.474,
        "confidence": 1
      },
      {
        "time": 8.12,
        "confidence": 1
      },
      {
        "time": 8.581,
        "confidence": 1
      },
      {
        "time": 9.014,
        "confidence": 1
      },
      {
        "time": 9.506,
        "confidence": 1
      },
      {
        "time": 9.92,
        "confidence": 1
      },
      {
        "time": 10.345,
        "confidence": 1
      },
      {
        "time": 10.813,
        "confidence": 1
      },
      {
        "time": 11.746,
        "confidence": 1
      },
      {
        "time": 12.361,
        "confidence": 1
      },
      {
        "time": 12.791,
        "confidence": 1
      },
      {
        "time": 13.232,
        "confidence": 1
      },
      {
        "time": 13.681,
        "confidence": 1
      },
      {
        "time": 14.088,
        "confidence": 1
      },
      {
        "time": 14.482,
        "confidence": 1
      },
      {
        "time": 15.671,
        "confidence": 1
      },
      {
        "time": 16.626,
        "confidence": 1
      },
      {
        "time": 17.164,
        "confidence": 1
      },
      {
        "time": 17.687,
        "confidence": 1
      },
      {
        "time": 18.128,
        "confidence": 1
      },
      {
        "time": 18.596,
        "confidence": 1
      },
      {
        "time": 19.486,
        "confidence": 1
      },
      {
        "time": 19.943,
        "confidence": 1
      },
      {
        "time": 20.431,
        "confidence": 1
      },
      {
        "time": 20.945,
        "confidence": 1
      },
      {
        "time": 21.429,
        "confidence": 1
      },
      {
        "time": 21.882,
        "confidence": 1
      },
      {
        "time": 22.366,
        "confidence": 1
      },
      {
        "time": 22.869,
        "confidence": 1
      },
      {
        "time": 23.321,
        "confidence": 1
      },
      {
        "time": 26.595,
        "confidence": 1
      },
      {
        "time": 27.025,
        "confidence": 1
      },
      {
        "time": 30.446,
        "confidence": 1
      },
      {
        "time": 30.879,
        "confidence": 1
      },
      {
        "time": 31.293,
        "confidence": 1
      },
      {
        "time": 31.77,
        "confidence": 1
      },
      {
        "time": 32.226,
        "confidence": 1
      },
      {
        "time": 32.687,
        "confidence": 1
      },
      {
        "time": 33.144,
        "confidence": 1
      },
      {
        "time": 34.316,
        "confidence": 1
      },
      {
        "time": 34.711,
        "confidence": 1
      },
      {
        "time": 35.144,
        "confidence": 1
      },
      {
        "time": 35.577,
        "confidence": 1
      },
      {
        "time": 36.042,
        "confidence": 1
      },
      {
        "time": 36.494,
        "confidence": 1
      },
      {
        "time": 36.944,
        "confidence": 1
      },
      {
        "time": 38.058,
        "confidence": 1
      },
      {
        "time": 38.476,
        "confidence": 1
      },
      {
        "time": 38.913,
        "confidence": 1
      },
      {
        "time": 39.335,
        "confidence": 1
      },
      {
        "time": 39.842,
        "confidence": 1
      },
      {
        "time": 40.256,
        "confidence": 1
      },
      {
        "time": 40.759,
        "confidence": 1
      },
      {
        "time": 41.963,
        "confidence": 1
      },
      {
        "time": 42.343,
        "confidence": 1
      },
      {
        "time": 42.73,
        "confidence": 1
      },
      {
        "time": 43.151,
        "confidence": 1
      },
      {
        "time": 43.585,
        "confidence": 1
      },
      {
        "time": 44.018,
        "confidence": 1
      },
      {
        "time": 44.502,
        "confidence": 1
      },
      {
        "time": 44.943,
        "confidence": 1
      },
      {
        "time": 45.419,
        "confidence": 1
      },
      {
        "time": 45.968,
        "confidence": 1
      },
      {
        "time": 46.383,
        "confidence": 1
      },
      {
        "time": 46.832,
        "confidence": 1
      },
      {
        "time": 47.273,
        "confidence": 1
      },
      {
        "time": 47.714,
        "confidence": 1
      },
      {
        "time": 48.144,
        "confidence": 1
      },
      {
        "time": 48.643,
        "confidence": 1
      },
      {
        "time": 49.138,
        "confidence": 1
      },
      {
        "time": 49.648,
        "confidence": 1
      },
      {
        "time": 50.09,
        "confidence": 1
      },
      {
        "time": 50.578,
        "confidence": 1
      },
      {
        "time": 51.026,
        "confidence": 1
      },
      {
        "time": 51.456,
        "confidence": 1
      },
      {
        "time": 51.924,
        "confidence": 1
      },
      {
        "time": 52.385,
        "confidence": 1
      },
      {
        "time": 52.861,
        "confidence": 1
      },
      {
        "time": 53.329,
        "confidence": 1
      },
      {
        "time": 53.751,
        "confidence": 1
      },
      {
        "time": 54.273,
        "confidence": 1
      },
      {
        "time": 54.749,
        "confidence": 1
      },
      {
        "time": 55.217,
        "confidence": 1
      },
      {
        "time": 55.659,
        "confidence": 1
      },
      {
        "time": 56.147,
        "confidence": 1
      },
      {
        "time": 56.568,
        "confidence": 1
      },
      {
        "time": 57.056,
        "confidence": 1
      },
      {
        "time": 57.521,
        "confidence": 1
      },
      {
        "time": 57.989,
        "confidence": 1
      },
      {
        "time": 58.546,
        "confidence": 1
      },
      {
        "time": 59.007,
        "confidence": 1
      },
      {
        "time": 59.448,
        "confidence": 1
      },
      {
        "time": 59.896,
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
        "time": 61.301,
        "confidence": 1
      },
      {
        "time": 61.785,
        "confidence": 1
      },
      {
        "time": 62.265,
        "confidence": 1
      },
      {
        "time": 62.76,
        "confidence": 1
      },
      {
        "time": 63.245,
        "confidence": 1
      },
      {
        "time": 63.705,
        "confidence": 1
      },
      {
        "time": 64.162,
        "confidence": 1
      },
      {
        "time": 64.695,
        "confidence": 1
      },
      {
        "time": 65.152,
        "confidence": 1
      },
      {
        "time": 65.612,
        "confidence": 1
      },
      {
        "time": 66.081,
        "confidence": 1
      },
      {
        "time": 66.511,
        "confidence": 1
      },
      {
        "time": 66.959,
        "confidence": 1
      },
      {
        "time": 67.401,
        "confidence": 1
      },
      {
        "time": 67.861,
        "confidence": 1
      },
      {
        "time": 68.375,
        "confidence": 1
      },
      {
        "time": 68.832,
        "confidence": 1
      },
      {
        "time": 69.328,
        "confidence": 1
      },
      {
        "time": 69.769,
        "confidence": 1
      },
      {
        "time": 70.256,
        "confidence": 1
      },
      {
        "time": 70.659,
        "confidence": 1
      },
      {
        "time": 71.128,
        "confidence": 1
      },
      {
        "time": 71.584,
        "confidence": 1
      },
      {
        "time": 72.037,
        "confidence": 1
      },
      {
        "time": 72.521,
        "confidence": 1
      },
      {
        "time": 73,
        "confidence": 1
      },
      {
        "time": 73.484,
        "confidence": 1
      },
      {
        "time": 73.96,
        "confidence": 1
      },
      {
        "time": 74.421,
        "confidence": 1
      },
      {
        "time": 74.87,
        "confidence": 1
      },
      {
        "time": 75.365,
        "confidence": 1
      },
      {
        "time": 75.853,
        "confidence": 1
      },
      {
        "time": 82.942,
        "confidence": 1
      },
      {
        "time": 83.392,
        "confidence": 1
      },
      {
        "time": 86.696,
        "confidence": 1
      },
      {
        "time": 87.099,
        "confidence": 1
      }
    ],
    "longPlates": [
      {
        "start": 0.214,
        "end": 0.825,
        "confidence": 1
      },
      {
        "start": 16.12,
        "end": 16.32,
        "confidence": 1
      },
      {
        "start": 23.817,
        "end": 26.282,
        "confidence": 1
      },
      {
        "start": 27.512,
        "end": 29.823,
        "confidence": 1
      },
      {
        "start": 76.345,
        "end": 78.732,
        "confidence": 1
      },
      {
        "start": 79.87,
        "end": 81.197,
        "confidence": 2
      },
      {
        "start": 83.879,
        "end": 86.306,
        "confidence": 1
      },
      {
        "start": 87.587,
        "end": 90.276,
        "confidence": 1
      }
    ]
  }
};
})(window.TH = window.TH || {});
