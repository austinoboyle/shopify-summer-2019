# Winter 2019 Developer Intern Challenge

## Getting Started

### Running Locally

-   Make sure mongod is running (or set environment variables
    MONGO_URL,MONGO_USER,MONGO_PASS to connect to remote db)
-   `yarn`
-   `yarn start`
-   Navigate to `localhost:4000/graphql`

### Live Version

LIVE URL: http://shopify.austinoboyle.com
NOTE: https not currently working

### Authentication

App uses authorization header to do "authentication". Set the HTTP HEADERS in
the graphQL interface (bottom-left corner) to {"authorization": "USER_ID"} where
USER_ID is id of the user you are trying "logged in" with. You can query all
the users to see which ones are available.

### Resetting the Database

I created a utility route that resets the db to the seed data (see `/data`).
Navigate to the `/resetDB` route to use this.

## Database Design

_See `/models` for detailed schema definitions for the models_

### Requirements

-   Build an online marketplace that allows products to be queried for, and purchased.

This criteria could be satisfied with just one model - I called it Product. To
add some of the additional functionality of a marketplace, I also created 3
other models: User, Cart, and Order.

I used MongoDB, mainly because it is what I have used the most the past year,
and it quite easy to get a cloud instance up and running on mlab.

#### User

Users are registered members of our marketplace.

#### Product

Products are what are being sold in the marketplace. Any registered user can
add a product to the marketplace.

#### Cart

Carts represent an _incomplete_ Order. The model is quite similar, but has one key
distinction: Cart items are populated at **query-time**, and order items are
stored **in their entirety** in the database. This was done because Product
details may change while a product is in the cart. Order items are a
snapshot from that point in time.

#### Order

An order is created when a user successfully _submits_ their cart. It contains
a snapshop in time of the items in the purchase, their price, and a total.

## GraphQL API

This was my first time creating a GraphQL API, so it took a few tries to get
the hang of it. I started with a vanilla GraphQL server, but moved to Apollo
after I found out about it. The logic for the server is in `/config/apollo`.

### Types

**Location: `/config/apollo/types.js`**

Type descriptions are best displayed in the GraphQL Playground Schema Explorer.
Here is a list of custom types used.

-   User
-   Cart
-   Order
-   LineItem
-   Item
-   Product
-   Deletion

### Queries & Mutations

**Location: `/config/apollo/mutations` & `/config/apollo/queries.js`**
Again I will direct you to the GraphQL Playground Schema for documentation.
Here is a list of what's available:

**Queries:**

-   users
-   products
-   cart
-   orders

**Mutations:**

-   createUser
-   deleteMe
-   addToCart
-   updateItemQuentity
-   submitOrder
-   createProduct
-   updateProduct
-   deleteProduct

## (Pseudo)-Security

Routes are secured using using an authorization header that is "decoded" in the
context function for the ApolloServer. For this app, the authorization header
is set to a user's id, and not decoded at all. In a real app, this would be a
jwt/OAUTH Token/etc that gets checked/decoded on each request.

Many of the mutations/queries are restricted so that you only see your user's
data. Eg - Querying for orders will only return your user's past orders.

## Tests

**Command: `yarn test`**

Tests were written using jest, and are mainly integration tests for the Queries
and Mutations. The tests connect to a separate database instance than the main
app, and query/update it to test functionality. The tests reset the DB to the
seed data after every completed test. Running this in parallel was causing
race conditions so the tests are run with the --runInBand flag.

## Docker & Kubernetes

The app is deployed to a GKE Kubernetes cluster. The cluster was set up to have
2 pods and a load balancer that exposes the app to the public (see
`deployment.yml`). Each pod has a copy of a docker image created from
`Dockerfile`. I pointed a subdomain of my website to the load balancer.
