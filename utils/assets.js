const ASSETS = {
  0: { name: "Ftm", address: "0x0000000000000000000000000000000000000000" },
  1: { name: "Flex", address: "0x476cfd8523e767ea40eb094aac07d9a2e5f17ef1" },
  2: { name: "Link", address: "	0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F" },
  3: { name: "Usdt", address: "0xE14B4e52d15a3704502096b5aF28D4e2cd83Fb70" },
};

const ASSET_ADDRESS_TO_NAME = {
  "0x0000000000000000000000000000000000000000": "FTM",
  "0x476cfd8523e767ea40eb094aac07d9a2e5f17ef1": "FLEX",
  "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F": "LINK",
  "0xe14b4e52d15a3704502096b5af28d4e2cd83fb70": "USDT",
};

const convertToWei = (number) => {
  return (number * 10 ** 18).toString();
};

const PROPOSED =
  "0x18138887ed8f8a4616d54b76405eb3fa33c2aab6521500eeb368ba6d6235f05f";
const ACCEPTED =
  "0x66a524c81cf8e657f1147e56f41f83002f6210ee7ae7b08d255f786088ae96f7";
const FULFILLED =
  "0xb74222f78fc156480982316c437ce617f6222016c363e9141ec16c538b352a1e";
const DEACTIVATED =
  "0x5f16f9f4168aa3cf9fc13e514ca39a1d866ad1f66427b385fd41f75e874c6f89";

const STATE_BYTES_TO_STRING = {
  "0x18138887ed8f8a4616d54b76405eb3fa33c2aab6521500eeb368ba6d6235f05f":
    "PROPOSED",
  "0x66a524c81cf8e657f1147e56f41f83002f6210ee7ae7b08d255f786088ae96f7":
    "ACCEPTED",
  "0xb74222f78fc156480982316c437ce617f6222016c363e9141ec16c538b352a1e":
    "FULFILLLED",
  "0x5f16f9f4168aa3cf9fc13e514ca39a1d866ad1f66427b385fd41f75e874c6f89":
    "DEACTIVATED",
};

export function truncateAddr(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

module.exports = {
  ASSETS,
  ASSET_ADDRESS_TO_NAME,
  convertToWei,
  PROPOSED,
  ACCEPTED,
  FULFILLED,
  DEACTIVATED,
  STATE_BYTES_TO_STRING,
  truncateAddr,
};
