module ping::ping;

use sui::coin::{Self, TreasuryCap};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use std::option;

public struct PING has drop {}

fun init(witness: PING, ctx: &mut TxContext) {
    let (mut treasury, metadata) = coin::create_currency(
        witness,
        6,              // decimals
        b"PG",          // symbol
        b"PING",        // name
        b"",            // description
        option::none(), // icon url
        ctx,
    );
    
    let initial_supply = 1_000_000;
    let owner = tx_context::sender(ctx);
    let coin = coin::mint(&mut treasury, initial_supply, ctx);
    transfer::public_transfer(coin, owner);
   
    transfer::public_freeze_object(metadata);
    transfer::public_transfer(treasury, owner)
}

/// Mint new PING tokens and send them to a recipient.
public entry fun mint(
    treasury_cap: &mut TreasuryCap<PING>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let coin = coin::mint(treasury_cap, amount, ctx);
    transfer::public_transfer(coin, recipient)
}
