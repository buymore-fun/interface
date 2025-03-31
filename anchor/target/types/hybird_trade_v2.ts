export type HybirdTradeV2 = {
  "version": "0.1.0",
  "name": "hybird_trade_v2",
  "constants": [
    {
      "name": "AUTHORITY_SEED",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 118, 48]"
    },
    {
      "name": "MAX_ORDER_LIMIT",
      "type": "u64",
      "value": "100"
    },
    {
      "name": "ORDER_BOOK_WITH_TOKEN_SEED",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 111, 114, 100, 101, 114, 95, 119, 105, 116, 104, 95, 116, 111, 107, 101, 110, 95, 118, 48]"
    },
    {
      "name": "ORDER_CONFIG_SEED",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 111, 114, 100, 101, 114, 95, 99, 111, 110, 102, 105, 103, 95, 118, 48]"
    },
    {
      "name": "ORDER_COUNTER_SEED",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 111, 114, 100, 101, 114, 95, 99, 111, 117, 110, 116, 101, 114, 95, 118, 48]"
    },
    {
      "name": "SOL_VAULT_SEED",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 115, 111, 108, 95, 118, 97, 117, 108, 116, 95, 118, 48]"
    }
  ],
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "initializePool",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "orderBookDetail",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "addOrderToPool",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "proxySwapBaseInput",
      "accounts": [
        {
          "name": "cpSwapProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The user performing the swap"
          ]
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The factory state to read protocol fees"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The program account of the pool in which the swap will be performed"
          ]
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The user token account for input token"
          ]
        },
        {
          "name": "outputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The user token account for output token"
          ]
        },
        {
          "name": "inputVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The vault token account for input token"
          ]
        },
        {
          "name": "outputVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The vault token account for output token"
          ]
        },
        {
          "name": "inputTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program for input token transfers"
          ]
        },
        {
          "name": "outputTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program for output token transfers"
          ]
        },
        {
          "name": "inputTokenMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of input token"
          ]
        },
        {
          "name": "outputTokenMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of output token"
          ]
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The program account for the most recent oracle observation"
          ]
        }
      ],
      "args": [
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "minimumAmountOut",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelOrder",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "tradeOrder",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "trades",
          "type": {
            "vec": {
              "defined": "Trade"
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
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
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
                "defined": "Order"
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
            "type": "publicKey"
          },
          {
            "name": "max",
            "type": "u64"
          },
          {
            "name": "sysReceiver",
            "type": "publicKey"
          },
          {
            "name": "comReceiver",
            "type": "publicKey"
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
      "name": "ammConfig",
      "docs": [
        "Holds the current owner of the factory"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "disableCreatePool",
            "docs": [
              "Status to control if new pool can be create"
            ],
            "type": "bool"
          },
          {
            "name": "index",
            "docs": [
              "Config index"
            ],
            "type": "u16"
          },
          {
            "name": "tradeFeeRate",
            "docs": [
              "The trade fee, denominated in hundredths of a bip (10^-6)"
            ],
            "type": "u64"
          },
          {
            "name": "protocolFeeRate",
            "docs": [
              "The protocol fee"
            ],
            "type": "u64"
          },
          {
            "name": "fundFeeRate",
            "docs": [
              "The fund fee, denominated in hundredths of a bip (10^-6)"
            ],
            "type": "u64"
          },
          {
            "name": "createPoolFee",
            "docs": [
              "Fee for create a new pool"
            ],
            "type": "u64"
          },
          {
            "name": "protocolOwner",
            "docs": [
              "Address of the protocol fee owner"
            ],
            "type": "publicKey"
          },
          {
            "name": "fundOwner",
            "docs": [
              "Address of the fund fee owner"
            ],
            "type": "publicKey"
          },
          {
            "name": "padding",
            "docs": [
              "padding"
            ],
            "type": {
              "array": [
                "u64",
                16
              ]
            }
          }
        ]
      }
    },
    {
      "name": "observationState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "docs": [
              "Whether the ObservationState is initialized"
            ],
            "type": "bool"
          },
          {
            "name": "observationIndex",
            "docs": [
              "the most-recently updated index of the observations array"
            ],
            "type": "u16"
          },
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "observations",
            "docs": [
              "observation array"
            ],
            "type": {
              "array": [
                {
                  "defined": "Observation"
                },
                100
              ]
            }
          },
          {
            "name": "padding",
            "docs": [
              "padding for feature update"
            ],
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "poolState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ammConfig",
            "docs": [
              "Which config the pool belongs"
            ],
            "type": "publicKey"
          },
          {
            "name": "poolCreator",
            "docs": [
              "pool creator"
            ],
            "type": "publicKey"
          },
          {
            "name": "token0Vault",
            "docs": [
              "Token A"
            ],
            "type": "publicKey"
          },
          {
            "name": "token1Vault",
            "docs": [
              "Token B"
            ],
            "type": "publicKey"
          },
          {
            "name": "lpMint",
            "docs": [
              "Pool tokens are issued when A or B tokens are deposited.",
              "Pool tokens can be withdrawn back to the original A or B token."
            ],
            "type": "publicKey"
          },
          {
            "name": "token0Mint",
            "docs": [
              "Mint information for token A"
            ],
            "type": "publicKey"
          },
          {
            "name": "token1Mint",
            "docs": [
              "Mint information for token B"
            ],
            "type": "publicKey"
          },
          {
            "name": "token0Program",
            "docs": [
              "token_0 program"
            ],
            "type": "publicKey"
          },
          {
            "name": "token1Program",
            "docs": [
              "token_1 program"
            ],
            "type": "publicKey"
          },
          {
            "name": "observationKey",
            "docs": [
              "observation account to store oracle data"
            ],
            "type": "publicKey"
          },
          {
            "name": "authBump",
            "type": "u8"
          },
          {
            "name": "status",
            "docs": [
              "Bitwise representation of the state of the pool",
              "bit0, 1: disable deposit(vaule is 1), 0: normal",
              "bit1, 1: disable withdraw(vaule is 2), 0: normal",
              "bit2, 1: disable swap(vaule is 4), 0: normal"
            ],
            "type": "u8"
          },
          {
            "name": "lpMintDecimals",
            "type": "u8"
          },
          {
            "name": "mint0Decimals",
            "docs": [
              "mint0 and mint1 decimals"
            ],
            "type": "u8"
          },
          {
            "name": "mint1Decimals",
            "type": "u8"
          },
          {
            "name": "lpSupply",
            "docs": [
              "True circulating supply without burns and lock ups"
            ],
            "type": "u64"
          },
          {
            "name": "protocolFeesToken0",
            "docs": [
              "The amounts of token_0 and token_1 that are owed to the liquidity provider."
            ],
            "type": "u64"
          },
          {
            "name": "protocolFeesToken1",
            "type": "u64"
          },
          {
            "name": "fundFeesToken0",
            "type": "u64"
          },
          {
            "name": "fundFeesToken1",
            "type": "u64"
          },
          {
            "name": "openTime",
            "docs": [
              "The timestamp allowed for swap in the pool."
            ],
            "type": "u64"
          },
          {
            "name": "recentEpoch",
            "docs": [
              "recent epoch"
            ],
            "type": "u64"
          },
          {
            "name": "padding",
            "docs": [
              "padding for future updates"
            ],
            "type": {
              "array": [
                "u64",
                31
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "publicKey"
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
      "name": "OrderType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Buy"
          },
          {
            "name": "Sell"
          }
        ]
      }
    },
    {
      "name": "Trade",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "Observation",
      "docs": [
        "The element of observations in ObservationState"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blockTimestamp",
            "docs": [
              "The block timestamp of the observation"
            ],
            "type": "u64"
          },
          {
            "name": "cumulativeToken0PriceX32",
            "docs": [
              "the cumulative of token0 price during the duration time, Q32.32, the remaining 64 bit for overflow"
            ],
            "type": "u128"
          },
          {
            "name": "cumulativeToken1PriceX32",
            "docs": [
              "the cumulative of token1 price during the duration time, Q32.32, the remaining 64 bit for overflow"
            ],
            "type": "u128"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CancelOrder",
      "fields": [
        {
          "name": "poolId",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderId",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiver",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "NewOrder",
      "fields": [
        {
          "name": "poolId",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderId",
          "type": "u64",
          "index": false
        },
        {
          "name": "token",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          },
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "inAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "outAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "deadline",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "OrderQueueFull",
      "msg": "Order queue fullA"
    },
    {
      "code": 6001,
      "name": "InvalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6002,
      "name": "NotOwner",
      "msg": "Not owner"
    },
    {
      "code": 6003,
      "name": "OrderNotFound",
      "msg": "Order not found"
    }
  ]
};

export const IDL: HybirdTradeV2 = {
  "version": "0.1.0",
  "name": "hybird_trade_v2",
  "constants": [
    {
      "name": "AUTHORITY_SEED",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 118, 48]"
    },
    {
      "name": "MAX_ORDER_LIMIT",
      "type": "u64",
      "value": "100"
    },
    {
      "name": "ORDER_BOOK_WITH_TOKEN_SEED",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 111, 114, 100, 101, 114, 95, 119, 105, 116, 104, 95, 116, 111, 107, 101, 110, 95, 118, 48]"
    },
    {
      "name": "ORDER_CONFIG_SEED",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 111, 114, 100, 101, 114, 95, 99, 111, 110, 102, 105, 103, 95, 118, 48]"
    },
    {
      "name": "ORDER_COUNTER_SEED",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 111, 114, 100, 101, 114, 95, 99, 111, 117, 110, 116, 101, 114, 95, 118, 48]"
    },
    {
      "name": "SOL_VAULT_SEED",
      "type": "bytes",
      "value": "[98, 117, 121, 109, 111, 114, 101, 95, 115, 111, 108, 95, 118, 97, 117, 108, 116, 95, 118, 48]"
    }
  ],
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "initializePool",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "orderBookDetail",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "addOrderToPool",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "proxySwapBaseInput",
      "accounts": [
        {
          "name": "cpSwapProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The user performing the swap"
          ]
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The factory state to read protocol fees"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The program account of the pool in which the swap will be performed"
          ]
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The user token account for input token"
          ]
        },
        {
          "name": "outputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The user token account for output token"
          ]
        },
        {
          "name": "inputVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The vault token account for input token"
          ]
        },
        {
          "name": "outputVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The vault token account for output token"
          ]
        },
        {
          "name": "inputTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program for input token transfers"
          ]
        },
        {
          "name": "outputTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program for output token transfers"
          ]
        },
        {
          "name": "inputTokenMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of input token"
          ]
        },
        {
          "name": "outputTokenMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of output token"
          ]
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The program account for the most recent oracle observation"
          ]
        }
      ],
      "args": [
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "minimumAmountOut",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelOrder",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "tradeOrder",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "trades",
          "type": {
            "vec": {
              "defined": "Trade"
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
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
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
                "defined": "Order"
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
            "type": "publicKey"
          },
          {
            "name": "max",
            "type": "u64"
          },
          {
            "name": "sysReceiver",
            "type": "publicKey"
          },
          {
            "name": "comReceiver",
            "type": "publicKey"
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
      "name": "ammConfig",
      "docs": [
        "Holds the current owner of the factory"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "disableCreatePool",
            "docs": [
              "Status to control if new pool can be create"
            ],
            "type": "bool"
          },
          {
            "name": "index",
            "docs": [
              "Config index"
            ],
            "type": "u16"
          },
          {
            "name": "tradeFeeRate",
            "docs": [
              "The trade fee, denominated in hundredths of a bip (10^-6)"
            ],
            "type": "u64"
          },
          {
            "name": "protocolFeeRate",
            "docs": [
              "The protocol fee"
            ],
            "type": "u64"
          },
          {
            "name": "fundFeeRate",
            "docs": [
              "The fund fee, denominated in hundredths of a bip (10^-6)"
            ],
            "type": "u64"
          },
          {
            "name": "createPoolFee",
            "docs": [
              "Fee for create a new pool"
            ],
            "type": "u64"
          },
          {
            "name": "protocolOwner",
            "docs": [
              "Address of the protocol fee owner"
            ],
            "type": "publicKey"
          },
          {
            "name": "fundOwner",
            "docs": [
              "Address of the fund fee owner"
            ],
            "type": "publicKey"
          },
          {
            "name": "padding",
            "docs": [
              "padding"
            ],
            "type": {
              "array": [
                "u64",
                16
              ]
            }
          }
        ]
      }
    },
    {
      "name": "observationState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "docs": [
              "Whether the ObservationState is initialized"
            ],
            "type": "bool"
          },
          {
            "name": "observationIndex",
            "docs": [
              "the most-recently updated index of the observations array"
            ],
            "type": "u16"
          },
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "observations",
            "docs": [
              "observation array"
            ],
            "type": {
              "array": [
                {
                  "defined": "Observation"
                },
                100
              ]
            }
          },
          {
            "name": "padding",
            "docs": [
              "padding for feature update"
            ],
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "poolState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ammConfig",
            "docs": [
              "Which config the pool belongs"
            ],
            "type": "publicKey"
          },
          {
            "name": "poolCreator",
            "docs": [
              "pool creator"
            ],
            "type": "publicKey"
          },
          {
            "name": "token0Vault",
            "docs": [
              "Token A"
            ],
            "type": "publicKey"
          },
          {
            "name": "token1Vault",
            "docs": [
              "Token B"
            ],
            "type": "publicKey"
          },
          {
            "name": "lpMint",
            "docs": [
              "Pool tokens are issued when A or B tokens are deposited.",
              "Pool tokens can be withdrawn back to the original A or B token."
            ],
            "type": "publicKey"
          },
          {
            "name": "token0Mint",
            "docs": [
              "Mint information for token A"
            ],
            "type": "publicKey"
          },
          {
            "name": "token1Mint",
            "docs": [
              "Mint information for token B"
            ],
            "type": "publicKey"
          },
          {
            "name": "token0Program",
            "docs": [
              "token_0 program"
            ],
            "type": "publicKey"
          },
          {
            "name": "token1Program",
            "docs": [
              "token_1 program"
            ],
            "type": "publicKey"
          },
          {
            "name": "observationKey",
            "docs": [
              "observation account to store oracle data"
            ],
            "type": "publicKey"
          },
          {
            "name": "authBump",
            "type": "u8"
          },
          {
            "name": "status",
            "docs": [
              "Bitwise representation of the state of the pool",
              "bit0, 1: disable deposit(vaule is 1), 0: normal",
              "bit1, 1: disable withdraw(vaule is 2), 0: normal",
              "bit2, 1: disable swap(vaule is 4), 0: normal"
            ],
            "type": "u8"
          },
          {
            "name": "lpMintDecimals",
            "type": "u8"
          },
          {
            "name": "mint0Decimals",
            "docs": [
              "mint0 and mint1 decimals"
            ],
            "type": "u8"
          },
          {
            "name": "mint1Decimals",
            "type": "u8"
          },
          {
            "name": "lpSupply",
            "docs": [
              "True circulating supply without burns and lock ups"
            ],
            "type": "u64"
          },
          {
            "name": "protocolFeesToken0",
            "docs": [
              "The amounts of token_0 and token_1 that are owed to the liquidity provider."
            ],
            "type": "u64"
          },
          {
            "name": "protocolFeesToken1",
            "type": "u64"
          },
          {
            "name": "fundFeesToken0",
            "type": "u64"
          },
          {
            "name": "fundFeesToken1",
            "type": "u64"
          },
          {
            "name": "openTime",
            "docs": [
              "The timestamp allowed for swap in the pool."
            ],
            "type": "u64"
          },
          {
            "name": "recentEpoch",
            "docs": [
              "recent epoch"
            ],
            "type": "u64"
          },
          {
            "name": "padding",
            "docs": [
              "padding for future updates"
            ],
            "type": {
              "array": [
                "u64",
                31
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "publicKey"
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
      "name": "OrderType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Buy"
          },
          {
            "name": "Sell"
          }
        ]
      }
    },
    {
      "name": "Trade",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "Observation",
      "docs": [
        "The element of observations in ObservationState"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blockTimestamp",
            "docs": [
              "The block timestamp of the observation"
            ],
            "type": "u64"
          },
          {
            "name": "cumulativeToken0PriceX32",
            "docs": [
              "the cumulative of token0 price during the duration time, Q32.32, the remaining 64 bit for overflow"
            ],
            "type": "u128"
          },
          {
            "name": "cumulativeToken1PriceX32",
            "docs": [
              "the cumulative of token1 price during the duration time, Q32.32, the remaining 64 bit for overflow"
            ],
            "type": "u128"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CancelOrder",
      "fields": [
        {
          "name": "poolId",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderId",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiver",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "NewOrder",
      "fields": [
        {
          "name": "poolId",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderId",
          "type": "u64",
          "index": false
        },
        {
          "name": "token",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          },
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "inAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "outAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "deadline",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "OrderQueueFull",
      "msg": "Order queue fullA"
    },
    {
      "code": 6001,
      "name": "InvalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6002,
      "name": "NotOwner",
      "msg": "Not owner"
    },
    {
      "code": 6003,
      "name": "OrderNotFound",
      "msg": "Order not found"
    }
  ]
};
