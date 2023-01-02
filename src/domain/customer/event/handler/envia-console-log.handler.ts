import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerHasChangedAddressEvent, { CustomerHasChangedAddressData } from "../customer-has-changed-address.event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<CustomerHasChangedAddressEvent>{
    handle(event: CustomerHasChangedAddressEvent): void {
        let {customerId, 
            customerName, 
            customerNewAddress} = event.data as CustomerHasChangedAddressData;

        console.log("Endereço do cliente: " + customerId + ", " + customerName + 
        " alterado para: " + customerNewAddress.toString() + ".");
    }
}