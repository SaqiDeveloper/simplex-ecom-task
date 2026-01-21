import asyncErrorHandler from "../../utils/asyncErrorHandler";
import { STATUS_CODES, TEXTS } from "../../config/constants";
import { products, productVariants } from '../../models';
import { Op } from 'sequelize';
import { AuthenticatedRequest } from '../../types';
import { Response } from 'express';

const createVariant = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { productId } = req.params;

    const product = await products.findByPk(productId);

    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: TEXTS.PRODUCT_NOT_FOUND
        });
    }

    const { variantsName, value, price } = req.body;

    const newVariant = await productVariants.create({
        productId: productId,
        variantsName: variantsName,
        value: value,
        price: price,
    });

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.VARIANT_CREATED,
        data: newVariant
    });
});

const getVariant = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { productId } = req.params;

    const product = await products.findByPk(productId);

    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: TEXTS.PRODUCT_NOT_FOUND
        });
    }

    const variants = await productVariants.findAll({
        where: { productId: productId }
    });

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.VARIANTS_FETCHED,
        data: variants
    });
});

const getAllVariants = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    try {
        let where: any = {};
        const searchQuery = req?.query?.search;
        if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim() !== "") {
            where.variantsName = {
                [Op.iLike]: `${searchQuery}%`
            };
        }

        const variants = await productVariants.findAll({
            where: where,
            ...req.pagination
        });

        return res.status(STATUS_CODES.SUCCESS).json({
            statusCode: STATUS_CODES.SUCCESS,
            message: TEXTS.VARIANTS_FETCHED,
            data: variants || []
        });
    } catch (error: any) {
        console.error("Error in getAllVariants:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "Internal server error",
            error: error.message
        });
    }
});

const updateVariant = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { variantId } = req.params;

    const variant = await productVariants.findByPk(variantId);

    if (!variant) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: TEXTS.VARIANT_NOT_FOUND
        });
    }

    const { variantsName, value, price } = req.body;
    
    if (variantsName) variant.variantsName = variantsName;
    if (value) variant.value = value;
    if (price !== undefined) variant.price = price;

    await variant.save();

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.VARIANT_UPDATED
    });
});

const deleteVariant = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { variantId } = req.params;

    const variant = await productVariants.findByPk(variantId);

    if (!variant) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: TEXTS.VARIANT_NOT_FOUND
        });
    }

    await variant.destroy();

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.VARIANT_DELETED
    });
});

export default { createVariant, getVariant, getAllVariants, updateVariant, deleteVariant };

