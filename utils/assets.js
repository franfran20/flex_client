export const ASSETS = {
  0: { name: "Ftm", address: "0x0000000000000000000000000000000000000000" },
  1: { name: "Flex", address: "0x476cFd8523e767eA40Eb094AAc07D9A2e5F17Ef1" },
  2: { name: "Link", address: "	0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F" },
  3: { name: "Usdt", address: "0xE14B4e52d15a3704502096b5aF28D4e2cd83Fb70" },
};

export const convertToWei = (number) => {
  return (number * 10 ** 18).toString();
};
