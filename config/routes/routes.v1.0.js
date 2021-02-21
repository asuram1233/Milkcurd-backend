"use strict";

import express from "express";
import { isUser } from "../../api/v1.0/auth/auth.service";

import merchants from "../../api/v1.0/merchants/routes/merchants.route";
import users from "../../api/v1.0/users/routes/users.route";
import categories from "../../api/v1.0/categories/routes/categories.route";
import products from "../../api/v1.0/products/routes/products.route";
import orders from "../../api/v1.0/orders/routes/orders.route";
import carts from "../../api/v1.0/carts/routes/carts.route";
import addresses from "../../api/v1.0/addresses/routes/addresses.route";
import states from "../../api/v1.0/states/routes/states.route";
import cities from "../../api/v1.0/cities/routes/cities.route";
import pincodes from "../../api/v1.0/pincodes/routes/pincodes.route";
import feedbacks from "../../api/v1.0/feedbacks/routes/feedbacks.route";

let app = express();

app.use("/merchants", merchants);
app.use("/users", isUser.authorised, users);
app.use("/categories", isUser.authorised, categories);
app.use("/products", isUser.authorised, products);
app.use("/orders", isUser.authorised, orders);
app.use("/carts", isUser.authorised, carts);
app.use("/addresses", isUser.authorised, addresses);
app.use("/states", isUser.authorised, states);
app.use("/cities", isUser.authorised, cities);
app.use("/pincodes", isUser.authorised, pincodes);
app.use("/feedbacks", isUser.authorised, feedbacks);

export default app;
