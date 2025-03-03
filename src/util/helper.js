export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function mergeSameCartItems(cart) {
  console.log("cart", cart);
  return cart.reduce((arr, item) => {
    const currentItem = arr.find((ele) => ele.id === item.id);

    if (currentItem) {
      currentItem.quantity += item.quantity;
      currentItem.total = item.price * currentItem.quantity;
    } else {
      arr.push({ ...item });
    }
    return arr;
  }, []);
}
