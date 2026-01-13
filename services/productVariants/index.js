const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { products, productVariants } = require('../../models');
const { Op } = require('sequelize');

const createVariant = asyncErrorHandler(async (req, res) => {

    const { productId } = req.params;

    const product = await products.findByPk(productId);

    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: TEXTS.PRODUCT_NOT_FOUND
        })
    }

    const { variantsName, value, price } = req.body;

    const newVariant = await productVariants.create({
        productId: productId,
        variantsName: variantsName,
        value: value,
        price: price,
    });

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.VARIANT_CREATED,
        data: newVariant
    })

});

const getVariant = asyncErrorHandler(async (req, res) => {

    const { productId } = req.params;

    const product = await products.findByPk(productId);

    if (!product) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: TEXTS.PRODUCT_NOT_FOUND
        })
    }

    const variants = await productVariants.findAll({
        where : {productId: productId}
    });

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.VARIANTS_FETCHED,
        data: variants
    })
});

const getAllVariants = asyncErrorHandler(async (req, res) => {
    try {
        let where = {}
        if (req?.query?.search && req.query.search.trim() !== "") {
            where.variantsName = {
                [Op.iLike]: `${req.query.search}%`
            };
        }

        const variants = await productVariants.findAll({
            where: where,
            ...req.pagination
        });

        res.status(STATUS_CODES.SUCCESS).json({
            statusCode: STATUS_CODES.SUCCESS,
            message: TEXTS.VARIANTS_FETCHED,
            data: variants || []
        })
    } catch (error) {
        console.error("Error in getAllVariants:", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "Internal server error",
            error: error.message
        })
    }
});

const updateVariant = asyncErrorHandler(async (req, res) => {

    const { variantId } = req.params;

    const variant = await productVariants.findByPk(variantId);

    if (!variant) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: TEXTS.VARIANT_NOT_FOUND
        })
    }

    const { variantsName, value, price } = req.body;
    
    if (variantsName) variant.variantsName = variantsName;
    if (value) variant.value = value;
    if (price !== undefined) variant.price = price;

    await variant.save();

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.VARIANT_UPDATED
    })
});

const deleteVariant = asyncErrorHandler(async (req, res) => {

    const { variantId } = req.params;

    const variant = await productVariants.findByPk(variantId);

    if (!variant) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: TEXTS.VARIANT_NOT_FOUND
        })
    }

    await variant.destroy();

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.VARIANT_DELETED
    })

});


module.exports = { createVariant, getVariant, getAllVariants, updateVariant, deleteVariant }