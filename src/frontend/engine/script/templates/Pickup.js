export default {
  "name": "Pickup",
  "nodes": [
    {
      "type": "OnCollide",
      "internalValues": []
    },
    {
      "type": "EntityHasVariable",
      "internalValues": []
    },
    {
      "type": "DestroyEntity",
      "internalValues": []
    },
    {
      "type": "PlaySound",
      "internalValues": []
    },
    {
      "type": "ExportSound",
      "internalValues": [
        "sound",
        "coin"
      ]
    },
    {
      "type": "ExportString",
      "internalValues": [
        "export",
        "isPickup"
      ]
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 0,
          "inputNode": 1
        },
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 0,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 0,
          "inputNode": 1
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 1,
          "inputNode": 2
        },
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 1,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 1,
          "inputNode": 2
        },
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 0,
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
          "outputNode": 4,
          "inputNode": 3
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 1,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 1
        }
      ]
    }
  ]
}