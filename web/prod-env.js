System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var environment;
    return {
        setters:[],
        execute: function() {
            exports_1("environment", environment = {
                production: true,
                baseUrl: 'https://kamrusepa-api.herokuapp.com/api',
                externalIp: 'https://api.ipify.org',
                wsUrl: 'ws://kamrusepa-api.herokuapp.com'
            });
        }
    }
});
//# sourceMappingURL=prod-env.js.map