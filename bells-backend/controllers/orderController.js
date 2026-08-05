import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

// POST /api/orders
export async function createOrder(req, res) {
  const { items, shippingAddress, shippingFee = 0 } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Cart items are required" });
  }
  if (!shippingAddress) {
    return res.status(400).json({ message: "Shipping address is required" });
  }

  // Rebuild items from the DATABASE, not the client — never trust prices sent from the frontend
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(404).json({ message: `Product not found: ${item.productId}` });
    }
    if (product.stock < item.qty) {
      return res.status(409).json({ message: `Not enough stock for ${product.name}` });
    }

    const price = product.onSale ? product.salePrice : product.price;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price,
      qty: item.qty,
    });

    subtotal += price * item.qty;
  }

  const total = subtotal + shippingFee;

  const order = await Order.create({
    user: req.userId,
    items: orderItems,
    shippingAddress,
    subtotal,
    shippingFee,
    total,
  });

  // decrement stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
  }

  res.status(201).json({ message: "Order placed", order });
}

// GET /api/orders/my
export async function getMyOrders(req, res) {
  const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
  res.status(200).json({ orders });
}

// GET /api/orders/:id
export async function getOrderById(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  if (order.user.toString() !== req.userId) {
    return res.status(403).json({ message: "Not authorized to view this order" });
  }
  res.status(200).json({ order });
}