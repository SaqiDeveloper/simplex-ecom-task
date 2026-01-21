import asyncErrorHandler from "../../utils/asyncErrorHandler";
import { STATUS_CODES } from "../../config/constants";
import { carts, cartItems, products, productVariants } from '../../models';
import Sequelize from 'sequelize';
import { AuthenticatedRequest } from '../../types';
import { Response } from 'express';

const getOrCreateCart = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    let cart = await carts.findOne({
        where: {
            userId: userId,
            status: 'active'
        },
        include: [{
            model: cartItems,
            as: 'CartItems',
            include: [
                {
                    model: products,
                    as: 'Product'
                },
                {
                    model: productVariants,
                    as: 'Variant',
                    required: false
                }
            ]
        }]
    });

    if (!cart) {
        cart = await carts.create({
            userId: userId,
            status: 'active',
            totalAmount: 0.00
        });
    }

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Cart fetched successfully",
        data: cart
    });
});

const addItemToCart = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { productId, variantId, quantity } = req.body;
    let cart = await carts.findOne({
        where: {
            userId: userId,
            status: 'active'
        }
    });

    if (!cart) {
        cart = await carts.create({
            userId: userId,
            status: 'active',
            totalAmount: 0.00
        });
    }

    const product = await products.findByPk(productId);
    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Product not found"
        });
    }

    let variant = null;
    let itemPrice = product.price || 0.00;

    if (variantId) {
        variant = await productVariants.findOne({
            where: {
                id: variantId,
                productId: productId
            }
        });

        if (!variant) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                statusCode: STATUS_CODES.NOT_FOUND,
                message: "Variant not found for this product"
            });
        }
        itemPrice = variant.price;
    }

    const existingItem = await cartItems.findOne({
        where: {
            cartId: cart.id,
            productId: productId,
            variantId: variantId || null
        }
    });

    let cartItem;
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal = existingItem.quantity * itemPrice;
        await existingItem.save();
        cartItem = existingItem;
    } else {
        cartItem = await cartItems.create({
            cartId: cart.id,
            productId: productId,
            variantId: variantId || null,
            quantity: quantity,
            price: itemPrice,
            subtotal: quantity * itemPrice
        });
    }

    await updateCartTotal(cart.id);

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Item added to cart successfully",
        data: cartItem
    });
});

const updateCartItem = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Find cart item and verify it belongs to user's cart
    const cartItem = await cartItems.findOne({
        where: { id: itemId },
        include: [{
            model: carts,
            as: 'Cart',
            where: {
                userId: userId,
                status: 'active'
            }
        }]
    });

    if (!cartItem) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Cart item not found"
        });
    }

    cartItem.quantity = quantity;
    cartItem.subtotal = quantity * cartItem.price;
    await cartItem.save();

    await updateCartTotal(cartItem.cartId);

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Cart item updated successfully",
        data: cartItem
    });
});

const removeCartItem = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { itemId } = req.params;

    const cartItem = await cartItems.findOne({
        where: { id: itemId },
        include: [{
            model: carts,
            as: 'Cart',
            where: {
                userId: userId,
                status: 'active'
            }
        }]
    });

    if (!cartItem) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Cart item not found"
        });
    }

    const cartId = cartItem.cartId;
    await cartItem.destroy();

    await updateCartTotal(cartId);

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Item removed from cart successfully"
    });
});

const clearCart = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const cart = await carts.findOne({
        where: {
            userId: userId,
            status: 'active'
        }
    });

    if (!cart) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Cart not found"
        });
    }

    await cartItems.destroy({
        where: { cartId: cart.id }
    });

    cart.totalAmount = 0.00;
    await cart.save();

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: "Cart cleared successfully"
    });
});

const updateCartTotal = async (cartId: string) => {
    const result = await cartItems.findAll({
        where: { cartId: cartId },
        attributes: [
            [Sequelize.fn('SUM', Sequelize.col('subtotal')), 'total']
        ],
        raw: true
    });

    const total = parseFloat((result[0] as any)?.total || 0);
    
    await carts.update(
        { totalAmount: total },
        { where: { id: cartId } }
    );
};

export default {
    getOrCreateCart,
    addItemToCart,
    updateCartItem,
    removeCartItem,
    clearCart
};

