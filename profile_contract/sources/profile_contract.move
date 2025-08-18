module profile_contract::profile {
    use sui::object::{Self, UID};

    struct Profile has key {
        id: UID,
        owner: address,
        suins_name: vector<u8>, // or string, depending on your needs
        connections: vector<address>, // or vector<UID> if you use object IDs
    }

    // Create a new profile
    public fun create_profile(owner: address, suins_name: vector<u8>, ctx: &mut TxContext): Profile {
        Profile {
            id: object::new(ctx),
            owner,
            suins_name,
            connections: vector::empty(),
        }
    }

    // Connect two profiles and reward
    public fun connect_and_reward(
        profile1: &mut Profile,
        profile2: &mut Profile,
        ping_module: &mut <your_address>::ping_token,
        ctx: &mut TxContext
    ) {
        // Ensure not already connected
        // (pseudo-code, you need to implement the check)
        // Add each other's address to connections
        vector::push_back(&mut profile1.connections, profile2.owner);
        vector::push_back(&mut profile2.connections, profile1.owner);

        // Reward both users
        <your_address>::ping_token::mint(profile1.owner, 1, ctx);
        <your_address>::ping_token::mint(profile2.owner, 1, ctx);
    }
}
