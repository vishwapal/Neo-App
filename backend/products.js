const products = Array.from({ length: 500 }, (_, index) => ({
  id: index + 1,
  title: `Product ${index + 1}`,
  price: (Math.random() * 500).toFixed(2),
  description: `This is the description for Product ${index + 1}.`,
  category: ["men's clothing", "women's clothing", "electronics", "jewelery"][
    Math.floor(Math.random() * 4)
  ],
  image: `https://via.placeholder.com/200?text=Product+${index + 1}`,
  rating: {
    rate: (Math.random() * 5).toFixed(1),
    count: Math.floor(Math.random() * 500),
  },
}));

export default products;
