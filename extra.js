function injectPropertyEvents(element, propertyName) {
    if (!(propertyName in element))
        throw new Error("Element does not have property " + propertyName);
 
    var propertyHolder = element;
    var descriptor;
    while (propertyHolder !== null) {
        descriptor = Object.getOwnPropertyDescriptor(propertyHolder, propertyName);
        if (descriptor)
            break;
        propertyHolder = Object.getPrototypeOf(propertyHolder);
    }
 
    if (!descriptor)
        throw new Error("Could not find property desciptor " + propertyName);
 
    if (propertyHolder.propertyEventsInjected)
        return;
 
    function raiseChangeEvent() {
        var event = new CustomEvent('change', { bubbles: true, cancelable: false });
        element.dispatchEvent(event);
    }
 
    Object.defineProperty(propertyHolder, propertyName, {
        configurable: true,
        get: function get() {
                return descriptor.get.call(this);

        },
        set: function(value) {
            console.log('value setted');
            var oldValue = descriptor.get.call(this);
            descriptor.set.call(this, value);
            if (oldValue !== value) {
                raiseChangeEvent();
            }
        }
    });
 
    propertyHolder.propertyEventsInjected = true;
}
   