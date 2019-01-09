const { createUser, deleteMe } = require("./users");
const { addToCart, updateItemQuantity, submitOrder } = require("./carts");
const { createProduct, deleteProduct, updateProduct } = require("./products");

exports.mutationTypes = `
    type Mutation{
        """
        Create a new user.
        
        **Access Necessary:** None
        """
        createUser(username: String!): User!

        """
        Delete your account.

        **Access Necessary:** USER
        """
        deleteMe: Deletion

        """
        Add a LineItem to a cart

        **Access Necessary:** USER
        """
        addToCart(product_id: ID!, quantity: Int = 1): Cart!
        
        """
        Update item quantity in cart

        **Access Necessary:** USER
        """
        updateItemQuantity(product_id: ID!, quantity: Int!): Cart!
        
        """
        Make a purchase

        **Access Necessary:** USER
        """
        submitOrder: Cart!

        """
        Start selling a product

        **Access Necessary:** USER
        """
        createProduct(title: String!, price: Float!, inventory_count: Int=1): Product!
        """

        Update a product's details (name, price, etc)

        **Access Necessary:** PRODUCT OWNER
        """
        updateProduct(id: ID!, title: String, price: Float, inventory_count: Int): Product!
        """
        Remove a product from shop's inventory

        **Access Necessary:** PRODUCT OWNER
        """
        deleteProduct(id: ID!): Deletion!
    }
`;

exports.mutationResolvers = {
    createUser,
    deleteMe,
    addToCart,
    updateItemQuantity,
    submitOrder,
    createProduct,
    updateProduct,
    deleteProduct
};
