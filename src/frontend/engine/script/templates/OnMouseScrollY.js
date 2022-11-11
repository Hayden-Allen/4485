export default {
  "name": "OnMouseScrollY",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "MouseScroll",
      "internalValues": []
    },
    {
      "type": "ConstVec2",
      "internalValues": [
        0,
        1
      ]
    },
    {
      "type": "Vec2Equals",
      "internalValues": []
    },
    {
      "type": "ConstVec2",
      "internalValues": [
        0,
        -1
      ]
    },
    {
      "type": "Vec2Equals",
      "internalValues": []
    },
    {
      "type": "OR",
      "internalValues": []
    },
    {
      "type": "__debug",
      "internalValues": [
        "debug"
      ]
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 3
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 3
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 2,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 3
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 2,
          "inputNode": 3
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 3
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 6
        },
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 6,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 6,
          "inputNode": 7
        }
      ],
      "out": []
    }
  ]
}