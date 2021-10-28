export default (ctx = {}) => {
  const { 
    $landing, 
    selectedProduct,
  } = ctx

  const onShow = () => {
    if(selectedProduct){
      $landing.data.set('offer', selectedProduct.name)
      $landing.data.set('buyer', selectedProduct.buyer.name)
    }
  }

  const onHide = () => {
    $landing.data.restoreDefaults()
  }

  return {
    onShow,
    onHide
  }
}