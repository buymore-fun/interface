/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/hybird_trade_v2.json`.
 */
export type HybirdTradeV2 = {
  "address": "2Tti1qEg9c2dDabQ5ZT12LuBfSfzQQj9txGoBdDDUaGN",
  "metadata": {
    "name": "hybirdTradeV2",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "The main program of the Hybird Trade V2"
  },
  "instructions": [
    {
      "name": "addOrderToPool",
      "discriminator": [
        157,
        233,
        78,
        163,
        112,
        100,
        82,
        45
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "orderBook",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  109,
                  111,
                  114,
                  101,
                  95,
                  111,
                  114,
                  100,
                  101,
                  114,
                  95,
                  119,
                  105,
                  116,
                  104,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  48
                ]
              },
              {
                "kind": "arg",
                "path": "poolId"
              },
              {
                "kind": "arg",
                "path": "typeV"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "fromAta",
          "writable": true
        },
        {
          "name": "solVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  109,
                  111,
                  114,
                  101,
                  95,
                  115,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  118,
                  48
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true
        },
        {
          "name": "poolAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  109,
                  111,
                  114,
                  101,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                  95,
                  118,
                  48
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "counter",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u64"
        },
        {
          "name": "typeV",
          "type": "u8"
        },
        {
          "name": "inAmount",
          "type": "u64"
        },
        {
          "name": "outAmount",
          "type": "u64"
        },
        {
          "name": "deadline",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelOrder",
      "discriminator": [
        95,
        129,
        237,
        240,
        8,
        49,
        223,
        132
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "orderBook",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  109,
                  111,
                  114,
                  101,
                  95,
                  111,
                  114,
                  100,
                  101,
                  114,
                  95,
                  119,
                  105,
                  116,
                  104,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  48
                ]
              },
              {
                "kind": "arg",
                "path": "poolId"
              },
              {
                "kind": "arg",
                "path": "typeV"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ]
          }
        },
        {
          "name": "solVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  109,
                  111,
                  114,
                  101,
                  95,
                  115,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  118,
                  48
                ]
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true
        },
        {
          "name": "poolAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  109,
                  111,
                  114,
                  101,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                  95,
                  118,
                  48
                ]
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "to",
          "writable": true
        },
        {
          "name": "toAta",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u64"
        },
        {
          "name": "typeV",
          "type": "u8"
        },
        {
          "name": "orderId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "counter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  109,
                  111,
                  114,
                  101,
                  95,
                  111,
                  114,
                  100,
                  101,
                  114,
                  95,
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114,
                  95,
                  118,
                  48
                ]
              }
            ]
          }
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  109,
                  111,
                  114,
                  101,
                  95,
                  111,
                  114,
                  100,
                  101,
                  114,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  95,
                  118,
                  48
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "initializePool",
      "discriminator": [
        95,
        180,
        10,
        172,
        84,
        174,
        232,
        40
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "solVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  109,
                  111,
                  114,
                  101,
                  95,
                  115,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  118,
                  48
                ]
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "poolAuthority"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "poolAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  109,
                  111,
                  114,
                  101,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                  95,
                  118,
                  48
                ]
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ]
          }
        },
        {
          "name": "orderBookDetail",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  109,
                  111,
                  114,
                  101,
                  95,
                  111,
                  114,
                  100,
                  101,
                  114,
                  95,
                  100,
                  101,
                  116,
                  97,
                  105,
                  108,
                  95,
                  118,
                  48
                ]
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ]
          }
        },
        {
          "name": "config"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "max",
          "type": "u64"
        }
      ]
    },
    {
      "name": "tradeOrder",
      "discriminator": [
        146,
        150,
        82,
        154,
        120,
        144,
        70,
        49
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "payerAta",
          "writable": true
        },
        {
          "name": "solVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  109,
                  111,
                  114,
                  101,
                  95,
                  115,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  118,
                  48
                ]
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true
        },
        {
          "name": "poolAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  109,
                  111,
                  114,
                  101,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                  95,
                  118,
                  48
                ]
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "selfProgram"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "trades",
          "type": {
            "vec": {
              "defined": {
                "name": "trade"
              }
            }
          }
        },
        {
          "name": "orderType",
          "type": "u8"
        },
        {
          "name": "inAmount",
          "type": "u64"
        },
        {
          "name": "minOutAmount",
          "type": "u64"
        },
        {
          "name": "deadline",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "buymoreConfig",
      "discriminator": [
        82,
        186,
        16,
        139,
        238,
        7,
        182,
        69
      ]
    },
    {
      "name": "orderBook",
      "discriminator": [
        55,
        230,
        125,
        218,
        149,
        39,
        65,
        248
      ]
    },
    {
      "name": "orderBookDetail",
      "discriminator": [
        157,
        207,
        208,
        252,
        171,
        43,
        138,
        148
      ]
    },
    {
      "name": "orderCounter",
      "discriminator": [
        124,
        210,
        2,
        119,
        178,
        200,
        59,
        95
      ]
    }
  ],
  "events": [
    {
      "name": "cancelOrder",
      "discriminator": [
        239,
        107,
        72,
        68,
        208,
        48,
        183,
        108
      ]
    },
    {
      "name": "newOrder",
      "discriminator": [
        198,
        96,
        173,
        165,
        85,
        16,
        92,
        63
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "orderQueueFull",
      "msg": "Order queue fullA"
    },
    {
      "code": 6001,
      "name": "invalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6002,
      "name": "notOwner",
      "msg": "Not owner"
    },
    {
      "code": 6003,
      "name": "orderNotFound",
      "msg": "Order not found"
    }
  ],
  "types": [
    {
      "name": "buymoreConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "cancelOrder",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "u64"
          },
          {
            "name": "orderId",
            "type": "u64"
          },
          {
            "name": "receiver",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "newOrder",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "u64"
          },
          {
            "name": "orderId",
            "type": "u64"
          },
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "orderType",
            "type": {
              "defined": {
                "name": "orderType"
              }
            }
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "inAmount",
            "type": "u64"
          },
          {
            "name": "outAmount",
            "type": "u64"
          },
          {
            "name": "deadline",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "inAmount",
            "type": "u64"
          },
          {
            "name": "outAmount",
            "type": "u64"
          },
          {
            "name": "deadline",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "orderBook",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "max",
            "type": "u64"
          },
          {
            "name": "orders",
            "type": {
              "vec": {
                "defined": {
                  "name": "order"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "orderBookDetail",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "max",
            "type": "u64"
          },
          {
            "name": "sysReceiver",
            "type": "pubkey"
          },
          {
            "name": "comReceiver",
            "type": "pubkey"
          },
          {
            "name": "feeRate",
            "type": "u64"
          },
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "total",
            "type": "u64"
          },
          {
            "name": "moreTotal",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "orderCounter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "value",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "orderType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "buy"
          },
          {
            "name": "sell"
          }
        ]
      }
    },
    {
      "name": "trade",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "pubkey"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "authoritySeed",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 118, 48]"
    },
    {
      "name": "maxOrderLimit",
      "type": "u64",
      "value": "100"
    },
    {
      "name": "orderBookWithTokenSeed",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 111, 114, 100, 101, 114, 95, 119, 105, 116, 104, 95, 116, 111, 107, 101, 110, 95, 118, 48]"
    },
    {
      "name": "orderConfigSeed",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 111, 114, 100, 101, 114, 95, 99, 111, 110, 102, 105, 103, 95, 118, 48]"
    },
    {
      "name": "orderCounterSeed",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 111, 114, 100, 101, 114, 95, 99, 111, 117, 110, 116, 101, 114, 95, 118, 48]"
    },
    {
      "name": "solVaultSeed",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 115, 111, 108, 95, 118, 97, 117, 108, 116, 95, 118, 48]"
    }
  ]
};
