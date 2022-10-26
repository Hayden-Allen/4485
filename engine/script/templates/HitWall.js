export default {
  "name": "HitWall",
  "nodes": [
    {
      "type": "OnCollide",
      "internalValues": []
    },
    {
      "type": "Vec2Components",
      "internalValues": []
    },
    {
      "type": "NOT",
      "internalValues": []
    },
    {
      "type": "AND",
      "internalValues": []
    },
    {
      "type": "__debug",
      "internalValues": [
        "hit"
      ]
    },
    {
      "type": "EqualsConst",
      "internalValues": [
        0
      ]
    },
    {
      "type": "EqualsConst",
      "internalValues": [
        0
      ]
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 0,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 0,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 6
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
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        },
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 3
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 3,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 3,
          "inputNode": 4
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
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 3
        }
      ]
    }
  ]
}