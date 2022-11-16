export default {
  "name": "PlaySoundOnSwitch",
  "nodes": [
    {
      "type": "OnSwitch",
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
        "boing"
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
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 1
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ],
      "out": []
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 1
        }
      ]
    }
  ]
}