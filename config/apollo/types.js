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
        owner: User!
        inventory_count: Int!
        price: Float!
    }

    """
    An order in progress.  Cart prices will update as product prices update.
    """
    type Cart {
        id: ID!
        user: User!
        items: [LineItem!]
        total: Float!
    }

    """
    The 'Product' portion of a LineItem.  Similar to a 'Product', but does not reference the inventory_count or owner.
    """
    type Item {
        id: ID!
        title: String!
        price: Float!
    }

    """
    A completed order.  Similar to carts, but frozen in time.  Cart prices will update as product prices update.
    """
    type Order {
        id: ID!
        user: User!
        items: [LineItem!]
        total: Float!
    }

    """
    Any service/product added to a cart/order, along with any quantities, rates, and prices that pertain to them.
    """
    type LineItem {
        product: Item!
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
