import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { Metaplex, MetaplexOptions } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata"; // Import Metadata type

export async function GET(_: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params;
    const res = await getTokenMetadata(address);

    return NextResponse.json({
      success: true,
      data: res,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message || error.toString() : "Unkown Error",
      success: false,
    });
  }
}

async function getTokenMetadata(mintAddress: string) {
  // 1. Setup connection
  // Can be changed to 'devnet', 'testnet' or your own RPC node
  const connection = new Connection(clusterApiUrl("devnet"));

  // 2. Create Metaplex instance
  // For read-only operations, usually only need connection
  const metaplex = Metaplex.make(connection);

  try {
    // 3. Convert string address to PublicKey
    const mintPublicKey = new PublicKey(mintAddress);

    // 4. Call findByMint to get metadata
    // This method gets both on-chain data and off-chain JSON data (if URI exists and is accessible)
    console.log(`Finding metadata for Mint Address: ${mintAddress}...`);
    const metadata = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });

    // 5. Process results
    if (!metadata) {
      console.log("No Metaplex metadata found for this Mint Address.");
      return;
    }

    console.log("\n--- On-chain Metadata (Partial) ---");
    console.log("Name:", metadata.name);
    console.log("Symbol:", metadata.symbol);
    console.log("URI:", metadata.uri);
    console.log("Is Mutable:", metadata.isMutable);
    console.log("Primary Sale Happened:", metadata.primarySaleHappened);
    console.log("Seller Fee Basis Points:", metadata.sellerFeeBasisPoints);
    // console.log("Creators:", metadata.creators); // Creator info is complex, expand as needed

    // 'metadata.json' contains off-chain JSON data fetched from URI
    // Note: If URI is invalid or inaccessible, json may be null or fail to fetch
    if (metadata.json) {
      console.log("\n--- Off-chain JSON Metadata (From URI) ---");
      console.log("Description:", metadata.json.description);
      console.log("Image:", metadata.json.image);
      // Can access other fields based on JSON structure, like attributes
      if (metadata.json.attributes) {
        console.log("Attributes:", metadata.json.attributes);
      }

      return metadata.json;
    } else if (metadata.uri) {
      console.log("\n--- Unable to Load Off-chain JSON Metadata ---");
      console.log(
        `Could not load JSON data from URI [${metadata.uri}], please check if URI is valid and publicly accessible.`
      );
    } else {
      console.log("\n--- No Off-chain JSON Metadata ---");
      console.log("This token has no URI configured.");
    }

    // You can also directly access the raw on-chain Metadata account data structure (if you need lower-level fields)
    // const onChainMetadata = metadata.metadataAccount.data;
    // console.log("\n--- Raw On-chain Data ---");
    // console.log(onChainMetadata);
  } catch (error) {
    console.error("Error getting metadata:", error);
    if (error instanceof Error && error.message.includes("Account does not exist")) {
      console.error(
        `Error details: ${mintAddress} may not be a valid Mint Account address, or it has no associated Metaplex Metadata Account.`
      );
    } else if (error instanceof Error && error.message.includes("Invalid public key input")) {
      console.error(
        `Error details: The provided address "${mintAddress}" is not a valid Solana Public Key format.`
      );
    }
  }
}
