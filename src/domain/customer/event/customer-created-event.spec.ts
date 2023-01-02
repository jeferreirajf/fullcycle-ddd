import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLogHandler1 from "./handler/envia-console-log1.handler";
import EnviaConsoleLogHandler2 from "./handler/envia-console-log2.handler";

describe("Customer created event unit test", () => {
    it("should create a CustomerCreatedEvent and fire two handlers", ()=>{
        const customerCreatedEvent = new CustomerCreatedEvent(null);

        const enviaConsoleHandler1Handler = new EnviaConsoleLogHandler1();
        const enviaConsoleHandler2Handler = new EnviaConsoleLogHandler2();

        const spyEventHandler1 = jest.spyOn(enviaConsoleHandler1Handler, "handle");
        const spyEventHandler2 = jest.spyOn(enviaConsoleHandler2Handler, "handle");

        const eventDispatcher = new EventDispatcher();
        eventDispatcher.register(customerCreatedEvent.constructor.name, enviaConsoleHandler1Handler);
        eventDispatcher.register(customerCreatedEvent.constructor.name, enviaConsoleHandler2Handler);

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalledTimes(1);
        expect(spyEventHandler2).toHaveBeenCalledTimes(1);
    });
});