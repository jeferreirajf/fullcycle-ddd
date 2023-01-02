import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {

  async create(entity: Order): Promise<void> {
    try {
      await OrderModel.create(
        {
          id: entity.id,
          customer_id: entity.customerId,
          total: entity.total(),
          items: entity.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
          })),
        },
        {
          include: [{ model: OrderItemModel }],
        }
      );
    }
    catch (error) {
      throw new Error("The order could not be created");
    }
  }

  async update(entity: Order): Promise<void> {

    entity.items.forEach(async (item) => {
      await OrderItemModel.update(
        {
          id: item.id,
          product_id: item.productId,
          order_id: entity.id,
          quantity: item.quantity,
          name: item.name,
          price: item.price
        },
        {
          where: {
            id: item.id
          }
        }
      )
    });

    await OrderModel.update({
      id: entity.id,
      total: entity.total(),
      items: entity.items
    },
      {
        where: {
          id: entity.id
        }
      });
  }

  async find(id: string): Promise<Order> {
    let orderModel: OrderModel;

    try {
      orderModel = await OrderModel.findOne({
        where: { id },
        include: ["items"],
        rejectOnEmpty: true
      });
    }
    catch (error) {
      throw new Error("Order not found.");
    }

    return this.generateOrderFromModel(orderModel);
  }

  async findAll(): Promise<Order[]> {
    let orderModelList: OrderModel[]

    try {
      orderModelList = await OrderModel.findAll({
        include: ["items"],
      });
    }
    catch (error) {
      throw new Error("Could not find orders.");
    }

    let orderList = orderModelList.map((item) => this.generateOrderFromModel(item));

    return orderList;
  }

  private generateOrderItemFromModel(orderItemModel: OrderItemModel): OrderItem {
    return new OrderItem(orderItemModel.id, orderItemModel.name,
      orderItemModel.price, orderItemModel.product_id,
      orderItemModel.quantity)
  }

  private generateOrderItemArrayFromModelArray(orderItemModelArray: OrderItemModel[]): OrderItem[] {
    return orderItemModelArray.map(orderItemModel =>
      this.generateOrderItemFromModel(orderItemModel));
  }

  private generateOrderFromModel(orderModel: OrderModel): Order {
    return new Order(orderModel.id, orderModel.customer_id,
      this.generateOrderItemArrayFromModelArray(orderModel.items));
  }
}
