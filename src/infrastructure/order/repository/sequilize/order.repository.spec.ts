import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {

    const customer = new Customer("000", "Wesley");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    const customerRepository = new CustomerRepository();
    customerRepository.create(customer);

    const product = new Product("111", "Product 1", 10);
    const productRepository = new ProductRepository();
    productRepository.create(product);

    const orderItem = new OrderItem(
      "222",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("333", "000", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    orderItem.changeQuantity(5);
    order.changeItems([orderItem]);

    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "333",
      customer_id: "000",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          product_id: orderItem.productId,
          order_id: "333",
          quantity: orderItem.quantity,
          name: orderItem.name,
          price: orderItem.price
        },
      ],
    });
  });

  it("should find an order by id", async () => {
    const customer = new Customer("000", "Wesley");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    const product = new Product("111", "Product 1", 10);
    const productRepository = new ProductRepository();
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "222",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("333", "000", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const newOrder = await orderRepository.find(order.id);

    expect(order).toStrictEqual(newOrder);
  });

  it("should find all orders", async () => {
    const customer = new Customer("000", "Wesley");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    const product = new Product("111", "Product 1", 10);
    const productRepository = new ProductRepository();
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "222",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("444", "000", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderItem2 = new OrderItem(
      "333",
      product.name,
      product.price,
      product.id,
      10
    );

    const order2 = new Order("555", "000", [orderItem2]);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders.length).toBe(2);
    expect(orders[0]).toStrictEqual(order);
    expect(orders[1]).toStrictEqual(order2);
  });
});