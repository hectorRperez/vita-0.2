const RenderProduct = product => {
  const hashViews = { 1: 'view_derma', default: 'view_products' };
  return (hashViews[product.category_id] || hashViews['default']) + '.ejs';
};

module.exports = { RenderProduct };
