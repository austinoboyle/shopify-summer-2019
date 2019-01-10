class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.status = status || 500;
    }
}

class UnauthorizedError extends AppError {
    constructor(message) {
        super(message || "Unauthorized", 401);
    }
}

class InventoryError extends AppError {
    constructor(product) {
        super(
            `InventoryError: ${product._id} only has ${
                product.inventory_count
            } items in stock.`,
            405
        );
    }
}

class DoesNotExistError extends AppError {
    constructor(message) {
        super(message || "Item Does Not Exist", 405);
    }
}

class OrderError extends AppError {
    constructor(message, invalidFields) {
        super(
            message || "One or more items in your cart could not be purchased.",
            405
        );
        this.invalidFields = invalidFields;
    }
}

module.exports = {
    OrderError,
    InventoryError,
    UnauthorizedError,
    AppError,
    DoesNotExistError
};
