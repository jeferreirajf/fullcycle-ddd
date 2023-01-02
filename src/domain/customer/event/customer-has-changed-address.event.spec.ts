import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerHasChangedAddressEvent, {CustomerHasChangedAddressData} from "./customer-has-changed-address.event";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";

describe("Customer has changed address unit test", ()=>{
    it("should create a CustomerHasChangedAddress event and fire a EnviaConsoleLogHandler", ()=>{
        const address = new Address("Street 1", 1, "zip code", "city 1");
        const customer = new Customer("123", "Wesley");
        customer.changeAddress(address);

        let customerHasChangedAddressEventData : CustomerHasChangedAddressData = {
            customerId: customer.id,
            customerName: customer.name,
            customerNewAddress: address
        };

        const customerHasChangedAddressEvent = 
            new CustomerHasChangedAddressEvent(customerHasChangedAddressEventData);

        const customerHasChangedAddressEventHandler = new EnviaConsoleLogHandler();

        const spyEventHandler = jest.spyOn(customerHasChangedAddressEventHandler, "handle");

        const eventDispatcher = new EventDispatcher();

        eventDispatcher.register(customerHasChangedAddressEvent.constructor.name, 
            customerHasChangedAddressEventHandler);

        eventDispatcher.notify(customerHasChangedAddressEvent);

        expect(spyEventHandler).toHaveBeenCalledTimes(1);
    });
});