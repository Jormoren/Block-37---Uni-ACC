const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/users');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const productTypesRouter = require('./routes/productTypes');
const authRouter = require('./routes/auth');
const mysql = require('mysql');

const {
  createTables,
  createUser,
  createProduct,
  createProductType,
  createCart,
  fetchAllUsers,
  fetchAllProducts,
  fetchCartProducts,
  createCartProduct,
  deleteCartProduct
} = require('./db');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'store'
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/product_types', productTypesRouter);
app.use('/api/auth', authRouter);

const init = async () => {
  try {
    await connection.connect();
    console.log('Connected to MySQL server as id ' + connection.threadId);
    await createTables();
    console.log('Tables created');

    // Product Types 
    const [soccer, football, volleyball] = await Promise.all([
      createProductType('soccer'),
      createProductType('football'),
      createProductType('volleyball')
    ]);

    // Users
    const [jorge, leo] = await Promise.all([
      createUser('jorge', 'moreno', 'jormoren@gmail.com', 'amzn1234'),
      createUser('leo', 'messi', 'messi@gmail.com', 'soccer24')
    ]);

    // Products
    const [Barcelona, Liverpool, PSG] = await Promise.all([
      createProduct({
        name: 'Barcelona',
        product_price: 190.00,
        description: 'UCL FC Barcelona home shirt 23/24',
        img: 'https://store.fcbarcelona.com/cdn/shop/files/DX2615-456_1.jpg?v=1709896978',
        qty_available: 100,
        product_type: soccer.id
      }),
      createProduct({
        name: 'Liverpool',
        product_price: 130.00,
        description: 'LFC Nike Mens 23/24 Home Stadium Jersey',
        img: 'https://store.liverpoolfc.com/media/catalog/product/cache/dd504f005c0b90ffe1b9fb2344db1a87/l/u/luis_diaz-177.jpg',
        qty_available: 100,
        product_type: football.id
      }),
      createProduct({
        name: 'PSG',
        product_price: 145.00,
        description: 'Paris Saint-Germain Nike Home Stadium Shirt 2023-24',
        img: 'https://images.footballfanatics.com/paris-saint-germain/paris-saint-germain-nike-home-stadium-shirt-2023-24-with-mbapp%C3%A9-7-printing_ss4_p-13398271+u-59irw4blmai610wy5ic+v-467410f1ba6844f2b64d109a690b1ce2.jpg?_hv=2&w=900',
        qty_available: 100,
        product_type: volleyball.id
      })
    ]);

    // Carts
    const [one, two] = await Promise.all([
      createCart({ user_id: jorge.id }),
      createCart({ user_id: leo.id })
    ]);

    console.log(await fetchAllUsers());
    console.log(await fetchAllProducts());

    // Cart Products
    const cartProducts = await Promise.all([
      createCartProduct(one.id, Barcelona.id, 1),
      createCartProduct(two.id, Liverpool.id, 1),
      createCartProduct(two.id, PSG.id, 2)
    ]);
    console.log(await fetchCartProducts(one.id));
    console.log(await fetchCartProducts(two.id));
    await deleteCartProduct(cartProducts[0].id);
    console.log(await fetchCartProducts());

    app.listen(3306, () => {
      console.log('Server is listening on port 3306!');
    });
  } catch (error) {
    console.error('Error connecting to MySQL server: ' + error.stack);
  }
};

init();
