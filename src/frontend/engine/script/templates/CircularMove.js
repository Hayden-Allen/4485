export default {
  "name": "CircularMove",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "GetTime",
      "internalValues": []
    },
    {
      "type": "Sine",
      "internalValues": []
    },
    {
      "type": "Cosine",
      "internalValues": []
    },
    {
      "type": "Multiply",
      "internalValues": []
    },
    {
      "type": "Multiply",
      "internalValues": []
    },
    {
      "type": "SetEntityPosition",
      "internalValues": []
    },
    {
      "type": "Add",
      "internalValues": []
    },
    {
      "type": "Add",
      "internalValues": []
    },
    {
      "type": "Vec2",
      "internalValues": []
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "radius",
        100
      ]
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "cx",
        0
      ]
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "cy",
        0
      ]
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "speed",
        1
      ]
    },
    {
      "type": "Multiply",
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
          "inputNode": 14
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
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
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
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 1,
          "inputIndex": 1,
          "outputNode": 2,
          "inputNode": 15
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 15,
          "inputNode": 3
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 15,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 11,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 8
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 6
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 11,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 9
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 7
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 10,
          "inputNode": 7
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 8
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 12,
          "inputNode": 8
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 8,
          "inputNode": 10
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 9
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 13,
          "inputNode": 9
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 9,
          "inputNode": 10
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 8,
          "inputNode": 10
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 9,
          "inputNode": 10
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 10,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 11,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 11,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 12,
          "inputNode": 8
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 13,
          "inputNode": 9
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 14
        }
      ],
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
          "outputIndex": 1,
          "inputIndex": 1,
          "outputNode": 2,
          "inputNode": 15
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 14,
          "inputNode": 15
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 15,
          "inputNode": 3
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 15,
          "inputNode": 4
        }
      ]
    }
  ]
}