export default {
  "name": "PongScore",
  "nodes": [
    {
      "type": "OnCollide",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "EntitySetVariable",
      "internalValues": [
        "score"
      ]
    },
    {
      "type": "GetEntityVariableInt",
      "internalValues": [
        "score"
      ]
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "Subtract",
      "internalValues": []
    },
    {
      "type": "ConstInt",
      "internalValues": [
        -1
      ]
    },
    {
      "type": "OnRender",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "GetEntityVariableInt",
      "internalValues": [
        "score"
      ]
    },
    {
      "type": "DrawText",
      "internalValues": [
        32,
        32
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
          "inputNode": 1
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
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
          "inputNode": 3
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 2
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 2
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
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
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 2
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
          "outputNode": 6,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 7,
          "inputNode": 8
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
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
          "inputNode": 10
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 9,
          "inputNode": 10
        }
      ],
      "out": []
    }
  ]
}