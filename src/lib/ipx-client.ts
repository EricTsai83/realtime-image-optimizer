import { createIPX, createIPXWebServer, ipxHttpStorage } from "ipx";

/**
 * Creates IPX instance configured for HTTP-only storage.
 * Accepts images from any domain by default.
 */
const ipx = createIPX({
  storage: ipxHttpStorage({
    // Allow all domains - can be restricted later via admin panel
    allowAllDomains: true,
  }),
});

const ipxWebHandler = createIPXWebServer(ipx);

export { ipx, ipxWebHandler };
