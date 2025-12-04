import { createIPX, createIPXWebServer, ipxHttpStorage } from "ipx";

const httpStorage = ipxHttpStorage({
  allowAllDomains: true,
});

/**
 * Creates IPX instance configured for HTTP-only storage.
 * Accepts images from any domain by default.
 */
const ipx = createIPX({
  storage: httpStorage,
  httpStorage: httpStorage,
});

const ipxWebHandler = createIPXWebServer(ipx);

export { ipx, ipxWebHandler };
