{
  "name": "test",
  "scenes": [
    {
      "entities": {
        "d1b456ba-3345-4557-be88-cdb8aecb1105": {
          "pos": {
            "x": -700,
            "y": -300
          }
        },
        "b1ee6fb2-1b95-4c0f-b3d4-4d7ba4dc75fd": {
          "pos": {
            "x": -700,
            "y": -150
          }
        },
        "ce7e3cd8-86f0-4b0b-9943-69c6576dd503": {
          "pos": {
            "x": -500,
            "y": -150
          }
        },
        "2b7df6f7-1f65-405d-866d-9a11d3e3898f": {
          "pos": {
            "x": 25,
            "y": -150.05000019845036
          },
          "states": [
            {
              "name": "Default",
              "scripts": [
                {
                  "templateName": "PlatformerJump"
                }
              ]
            }
          ]
        },
        "5879c8c5-142f-439a-9669-d34e68858b2a": {
          "pos": {
            "x": -575,
            "y": -150.05000019845022
          },
          "states": [
            {
              "name": "Default",
              "scripts": []
            }
          ]
        }
      },
      "layers": [
        {
          "static": [
            "d1b456ba-3345-4557-be88-cdb8aecb1105",
            "b1ee6fb2-1b95-4c0f-b3d4-4d7ba4dc75fd",
            "ce7e3cd8-86f0-4b0b-9943-69c6576dd503"
          ],
          "dynamic": []
        },
        {
          "static": [],
          "dynamic": [
            "2b7df6f7-1f65-405d-866d-9a11d3e3898f",
            "5879c8c5-142f-439a-9669-d34e68858b2a"
          ]
        }
      ],
      "controlledComponents": [
        "2b7df6f7-1f65-405d-866d-9a11d3e3898f",
        "5879c8c5-142f-439a-9669-d34e68858b2a"
      ]
    }
  ]
}