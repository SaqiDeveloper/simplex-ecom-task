import asyncErrorHandler from "../../utils/asyncErrorHandler";
import { STATUS_CODES, TEXTS } from "../../config/constants";
import { products } from '../../models';
import { paginatedResponse } from '../../middlewares/paginate';
import { Op } from 'sequelize';
import { AuthenticatedRequest } from '../../types';
import { Response } from 'express';

const createProduct = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { name, desc, isVariable, isActive, price, purchasePrice, profitMargin, stock } = req.body;

    const newProduct = await products.create({
        name: name,
        desc: desc,
        isVariable: isVariable || false,
        isActive: isActive !== undefined ? isActive : true,
        price: price || 0.00,
        purchasePrice: purchasePrice || 0.00,
        profitMargin: profitMargin || 0.00,
        stock: stock || null
    });

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.PRODUCT_CREATED,
        data: newProduct
    });
});

const getProduct = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { productId } = req.params;

    const product = await products.findByPk(productId);

    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: TEXTS.PRODUCT_NOT_FOUND
        });
    }

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.PRODUCT_FETCHED,
        data: product
    });
});

const getAllProducts = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    let where: any = {};
    const searchQuery = req?.query?.search;
    if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim() !== "") {
        where.name = {
            [Op.iLike]: `${searchQuery}%`
        };
    }

    const { rows, count } = await products.findAndCountAll({
        where: where,
        ...req.pagination
    });

    const result = paginatedResponse(rows, count, req.query?.page as number | undefined, req.query?.limit as number | undefined);

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.PRODUCTS_FETCHED,
        data: result
    });
});

const updateProduct = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { productId } = req.params;

    const product = await products.findByPk(productId);

    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: TEXTS.PRODUCT_NOT_FOUND
        });
    }

    const { name, desc, isVariable, isActive, price, purchasePrice, profitMargin, stock } = req.body;

    if (name) product.name = name;
    if (desc) product.desc = desc;
    if (isVariable !== undefined) product.isVariable = isVariable;
    if (isActive !== undefined) product.isActive = isActive;
    if (price !== undefined) product.price = price;
    if (purchasePrice !== undefined) product.purchasePrice = purchasePrice;
    if (profitMargin !== undefined) product.profitMargin = profitMargin;
    if (stock !== undefined) product.stock = stock;

    await product.save();

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.PRODUCT_UPDATED
    });
});

const deleteProduct = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { productId } = req.params;

    const product = await products.findByPk(productId);

    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: TEXTS.PRODUCT_NOT_FOUND
        });
    }

    await product.destroy();

    return res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.PRODUCT_DELETED
    });
});

export default { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct };

