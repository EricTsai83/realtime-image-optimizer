import {
  createIPX,
  createIPXWebServer,
  ipxFSStorage,
  ipxHttpStorage,
} from "ipx";

/**
 * Creates IPX instance configured for HTTP-only storage.
 * Accepts images from any domain by default.
 *
 * Note: `storage` is required by IPX, so we use an empty FS storage
 * pointing to a non-existent directory. All actual requests will use httpStorage.
 */
const ipx = createIPX({
  // Required by IPX - using empty storage since we only use HTTP sources
  storage: ipxFSStorage({ dir: "./.ipx-empty" }),
  httpStorage: ipxHttpStorage({
    // Allow all domains - can be restricted later via admin panel
    allowAllDomains: true,
  }),
});

const ipxWebHandler = createIPXWebServer(ipx);

export { ipx, ipxWebHandler };
