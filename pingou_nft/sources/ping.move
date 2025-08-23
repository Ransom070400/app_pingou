module ping::pingou_nft;
use std::string::String;
use sui::display;
use sui::package;

public struct PINGOU_NFT has drop{}

public struct PingouNFT has key {
    id: UID,
    name: String,
    description: String,
}

fun init(otw: PINGOU_NFT, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);
    let mut display = display::new<PingouNFT>(&publisher, ctx);
    display.add(b"image_url".to_string(), b"https://cocozqaswhyugfbilbxk.supabase.co/storage/v1/object/public/Codex-Lab/piger.jpg".to_string());
    display.update_version();
    transfer::public_transfer(display, ctx.sender());
    transfer::public_transfer(publisher, ctx.sender());
}

public fun mint_to_address(
    name: String,
    addr: address,
    ctx: &mut TxContext,
) {
    let nft = PingouNFT {
        id: object::new(ctx),
        name,
        description: b"Pingou Profile information".to_string()
    };
    transfer::transfer(nft, addr);
}