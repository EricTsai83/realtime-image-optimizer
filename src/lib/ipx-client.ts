import {
  createIPX,
  createIPXWebServer,
  ipxFSStorage,
  ipxHttpStorage,
} from "ipx";

const ipx = createIPX({
  alias: {
    uploadthing: "https://0tdnyn6tr7.ufs.sh/f",
  },
  storage: ipxFSStorage({ dir: "./static" }),
  httpStorage: ipxHttpStorage({
    domains: ["0tdnyn6tr7.ufs.sh/f"],
  }),
});

const ipxWebHandler = createIPXWebServer(ipx);

export { ipx, ipxWebHandler };
