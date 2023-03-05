export const gx1 = {
  "id": "r2",
  "attribution": {
    "contributor": {
      "resource": "fs:AutomatedContentExtraction"
    },
    "created": 1664543666729
  },
  "description": "#src_r2",
  "persons": [
    {
      "id": "p0",
      "extracted": true,
      "principal": true,
      "gender": {
        "type": "http://gedcomx.org/Male"
      },
      "names": [
        {
          "id": "3xfjjaotj",
          "nameForms": [
            {
              "fullText": "Uriel Hernández Méndez",
              "parts": [
                {
                  "type": "http://gedcomx.org/Given",
                  "value": "Uriel"
                },
                {
                  "type": "http://gedcomx.org/Surname",
                  "value": "Hernández Méndez"
                }
              ]
            }
          ]
        }
      ],
      "facts": [
        {
          "id": "fol93sh4n",
          "type": "http://gedcomx.org/Birth",
          "date": {
            "id": "gx-78",
            "original": "17 de junio de 1987"
          },
          "place": {
            "id": "gx-79",
            "original": "San Francisco del Norte, Chinandega, Nicaragua"
          },
          "primary": true
        }
      ]
    },
    {
      "id": "p1",
      "extracted": true,
      "principal": false,
      "gender": {
        "type": "http://gedcomx.org/Female"
      },
      "names": [
        {
          "id": "zbo8sf2jf",
          "nameForms": [
            {
              "fullText": "Tomasa Méndez Rodríguez",
              "parts": [
                {
                  "type": "http://gedcomx.org/Given",
                  "value": "Tomasa"
                },
                {
                  "type": "http://gedcomx.org/Surname",
                  "value": "Méndez Rodríguez"
                }
              ]
            }
          ]
        }
      ],
      "facts": [
        {
          "id": "5lt6y3vkd",
          "type": "http://gedcomx.org/Residence",
          "place": {
            "id": "gx-82",
            "original": "San Francisco del Norte, Chinandega, Nicaragua"
          },
          "primary": false
        },
        {
          "id": "s6jszl00j",
          "type": "http://gedcomx.org/Occupation",
          "value": "ama de casa",
          "primary": false
        }
      ],
      "fields": [
        {
          "type": "http://gedcomx.org/Role",
          "values": [
            {
              "text": "Mother"
            }
          ]
        }
      ]
    },
    {
      "id": "p2",
      "extracted": true,
      "principal": false,
      "gender": {
        "type": "http://gedcomx.org/Male"
      },
      "names": [
        {
          "id": "n66vp9c0a",
          "nameForms": [
            {
              "fullText": "Cristino Hernández Gómez",
              "parts": [
                {
                  "type": "http://gedcomx.org/Given",
                  "value": "Cristino"
                },
                {
                  "type": "http://gedcomx.org/Surname",
                  "value": "Hernández Gómez"
                }
              ]
            }
          ]
        }
      ],
      "facts": [
        {
          "id": "5ik540h36",
          "type": "http://gedcomx.org/Birth",
          "date": {
            "id": "gx-80",
            "original": "1945"
          },
          "primary": false
        },
        {
          "id": "r0uti5o9f",
          "type": "http://gedcomx.org/Residence",
          "place": {
            "id": "gx-81",
            "original": "San Francisco del Norte, Chinandega, Nicaragua"
          },
          "primary": false
        },
        {
          "id": "2kk536pdr",
          "type": "http://gedcomx.org/Occupation",
          "value": "agricultor",
          "primary": false
        }
      ],
      "fields": [
        {
          "type": "http://gedcomx.org/Role",
          "values": [
            {
              "text": "Father"
            }
          ]
        }
      ]
    },
    {
      "id": "p_999502646777",
      "extracted": true,
      "principal": false,
      "gender": {
        "type": "http://gedcomx.org/Male"
      },
      "names": [
        {
          "id": "n_ae5a47je3",
          "type": null,
          "nameForms": [
            {
              "fullText": "Dr. Juan Rodríguez Jr.",
              "parts": [
                {
                  "type": "http://gedcomx.org/Prefix",
                  "value": "Dr."
                },
                {
                  "type": "http://gedcomx.org/Given",
                  "value": "Juan"
                },
                {
                  "type": "http://gedcomx.org/Surname",
                  "value": "Rodríguez"
                },
                {
                  "type": "http://gedcomx.org/Suffix",
                  "value": "Jr."
                }
              ]
            }
          ]
        }
      ],
      "facts": [],
      "fields": []
    }
  ],
  "relationships": [
    {
      "id": "uggkkj3jc",
      "type": "http://gedcomx.org/ParentChild",
      "person1": {
        "resource": "#p1",
        "resourceId": "p1"
      },
      "person2": {
        "resource": "#p0",
        "resourceId": "p0"
      }
    },
    {
      "id": "1w7tw14y5",
      "type": "http://gedcomx.org/ParentChild",
      "person1": {
        "resource": "#p2",
        "resourceId": "p2"
      },
      "person2": {
        "resource": "#p0",
        "resourceId": "p0"
      }
    },
    {
      "id": "1lz2cw4zp",
      "type": "http://gedcomx.org/Couple",
      "person1": {
        "resource": "#p2",
        "resourceId": "p2"
      },
      "person2": {
        "resource": "#p1",
        "resourceId": "p1"
      }
    }
  ],
  "sourceDescriptions": [
    {
      "id": "src_r2",
      "about": "#r2",
      "resourceType": "http://gedcomx.org/Record",
      "coverage": [
        {
          "spatial": {
            "original": "San Francisco del Norte, Chinandega, Nicaragua"
          },
          "temporal": {
            "original": "13 de octubre de 1987"
          },
          "recordType": "http://gedcomx.org/Birth"
        }
      ],
      "sources": [
        {
          "description": "#src_r2",
          "descriptionId": "src_r2"
        }
      ]
    },
    {
      "id": "src_image_P326",
      "about": "https://familysearch.org/ark:/61903/3:1:S3HY-6P7Z-2FR",
      "resourceType": "http://gedcomx.org/DigitalArtifact",
      "identifiers": {
        "http://gedcomx.org/Persistent": [
          "https://familysearch.org/ark:/61903/3:1:S3HY-6P7Z-2FR"
        ]
      }
    }
  ],
  "documents": [
    {
      "id": "IMAGE_RECORD_COUNT",
      "text": "1"
    },
    {
      "id": "extractionNotes",
      "text": "Changed record number from 4 to 2.\nEl Guacimal seems to be an area of San Francisco del Norte"
    },
    {
      "id": "doc_tscvil9f9",
      "text": "Record 1"
    }
  ],
  "fields": [
    {
      "type": "http://familysearch.org/types/fields/DigitalFilmNbr",
      "values": [
        {
          "type": "http://gedcomx.org/Interpreted",
          "text": "004170272"
        }
      ]
    },
    {
      "type": "http://familysearch.org/types/fields/ImageNumber",
      "values": [
        {
          "type": "http://gedcomx.org/Interpreted",
          "text": "00326"
        }
      ]
    },
    {
      "type": "http://familysearch.org/types/fields/ImageNumber",
      "values": [
        {
          "type": "http://gedcomx.org/Interpreted",
          "text": "00327"
        }
      ]
    },
    {
      "type": "http://familysearch.org/types/fields/RecordStyle",
      "values": [
        {
          "type": "http://gedcomx.org/Interpreted",
          "text": "form-paragraph"
        }
      ]
    },
    {
      "type": "http://familysearch.org/types/fields/CrossType",
      "values": [
        {
          "type": "http://gedcomx.org/Interpreted",
          "text": "false"
        }
      ]
    }
  ]
};
