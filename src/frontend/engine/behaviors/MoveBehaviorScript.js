export default {
  "name": "PlayerController",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "KeyPressed",
      "internalValues": [
        "shift"
      ]
    },
    {
      "type": "KeyPressed",
      "internalValues": [
        "w"
      ]
    },
    {
      "type": "KeyPressed",
      "internalValues": [
        "a"
      ]
    },
    {
      "type": "KeyPressed",
      "internalValues": [
        "s"
      ]
    },
    {
      "type": "KeyPressed",
      "internalValues": [
        "d"
      ]
    },
    {
      "type": "Subtract",
      "internalValues": []
    },
    {
      "type": "Subtract",
      "internalValues": []
    },
    {
      "type": "Vec2",
      "internalValues": []
    },
    {
      "type": "Normalize",
      "internalValues": []
    },
    {
      "type": "ConstInt",
      "internalValues": [
        5
      ]
    },
    {
      "type": "ConstInt",
      "internalValues": [
        10
      ]
    },
    {
      "type": "Mux2",
      "internalValues": []
    },
    {
      "type": "ScaleVec2",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "SetEntityVelocity",
      "internalValues": []
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
          "inputNode": 1
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 2
        },
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
          "inputNode": 4
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
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 12
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 2,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
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
          "inputIndex": 1,
          "outputNode": 3,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
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
          "inputIndex": 0,
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
          "outputNode": 5,
          "inputNode": 6
        },
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 3,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 8
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 7
        },
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 2,
          "inputNode": 7
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 7,
          "inputNode": 8
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 8
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 7,
          "inputNode": 8
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 8,
          "inputNode": 9
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 8,
          "inputNode": 9
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 9,
          "inputNode": 13
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 10,
          "inputNode": 12
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 11,
          "inputNode": 12
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 12
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 10,
          "inputNode": 12
        },
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 11,
          "inputNode": 12
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 12,
          "inputNode": 13
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 9,
          "inputNode": 13
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 12,
          "inputNode": 13
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 13,
          "inputNode": 15
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 14,
          "inputNode": 15
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 14,
          "inputNode": 15
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 13,
          "inputNode": 15
        }
      ],
      "out": []
    }
  ]
}