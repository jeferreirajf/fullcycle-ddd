import EventInterface from "../../@shared/event/event.interface";
import Address from "../value-object/address";

export interface CustomerHasChangedAddressData{
    customerId: string,
    customerName: string,
    customerNewAddress: Address
};

export default class CustomerHasChangedAddressEvent implements EventInterface{
    dataTimeOccurred: Date;
    eventData: any;

    constructor(eventData: CustomerHasChangedAddressData){
        this.dataTimeOccurred = new Date();
        this.eventData = eventData;
    }

    get data(){
        return this.eventData
    }
}