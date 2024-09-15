const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  await model.update(bodyUpdate, {
    where: { id: productId },
  });
  if (isNew) {
    return await model.findOne({ where: { id: productId } });
  }
  return { message: "Product updated successfully" };
};
module.exports = {updateProductById}