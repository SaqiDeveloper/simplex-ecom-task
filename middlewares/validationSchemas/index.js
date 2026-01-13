module.exports = {
  // Auth schemas
  signUpSchema: require('./auth').signUpSchema,
  loginSchema: require('./auth').loginSchema,
  adminLoginSchema: require('./auth').adminLoginSchema,
  requestOTPSchema: require('./auth').requestOTPSchema,
  verifyOTPSchema: require('./auth').verifyOTPSchema,
  
  // Product schemas
  createProductSchema: require('./product').createProductSchema,
  updateProductSchema: require('./product').updateProductSchema,
  productIdParamSchema: require('./product').productIdParamSchema,
  
  // Product Variant schemas
  createVariantSchema: require('./productVariant').createVariantSchema,
  updateVariantSchema: require('./productVariant').updateVariantSchema,
  variantIdParamSchema: require('./productVariant').variantIdParamSchema,
  productIdParamSchemaForVariant: require('./productVariant').productIdParamSchema,
  
  // Cart schemas
  addItemToCartSchema: require('./cart').addItemToCartSchema,
  updateCartItemSchema: require('./cart').updateCartItemSchema,
  itemIdParamSchema: require('./cart').itemIdParamSchema,
  
  // Checkout schemas
  checkoutSchema: require('./checkout').checkoutSchema,
  orderIdParamSchema: require('./checkout').orderIdParamSchema,
};
