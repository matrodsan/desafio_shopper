import { db } from "../db.js";

export const getProducts = (_, res) => {
  const q = "SELECT * FROM products";

  db.query(q, (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data);
  });
};

export const updateProduct = (req, res) => {
  const updatedProducts = req.body;
  updatedProducts.forEach((product) => {
    const { code, new_price } = product;
    db.query(
      "UPDATE shopper.products SET sales_price = ? WHERE code = ?;",
      [new_price, code],
      (error) => {
        if (error) throw error;
      }
    );
  });
  res.send("Preço atualizado com sucesso!");
};
