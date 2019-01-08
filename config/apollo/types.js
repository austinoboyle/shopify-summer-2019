/**
 * Custom GraphQL Object Type Definitions
 * @module types
 */

let types = `
    """
    Someone awesome enough to make an account with us
    """
    type User {
        id: ID!
        username: String!
    }

    """
    An item being sold
    """
    type Product {
        id: ID!
        title: ID!
        owner: ID!
        inventory_count: Int!
        price: Float!
    }

    """
    An order in progress.  Carts can be active (user can still add items), or not - user has 'completed' the purchase.
    """
    type Cart {
        id: ID!
        user_id: ID!
        items: [LineItem!]
        total: Float!
        active: Boolean!
    }

    """
    Any service/product added to a cart/order, along with any quantities, rates, and prices that pertain to them.
    """
    type LineItem {
        product: Product!
        quantity: Int!
        total: Float!
    }

    """
    Raw MongoDB response when an item is deleted.  Returned whenever a full item is deleted.
    """
    type Deletion {
        ok: Int!
        n: Int!
    }

`;

module.exports = types;
