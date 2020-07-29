const serverAddr = "https://bij.leckrapi.xyz";
const localAddr = "http://192.168.178.221:4004";
const devLocal = true;

const Constants = {
  SERVER_ADDR: __DEV__ && devLocal ? localAddr : serverAddr,
  VERSION: "1",
};
export default Constants;
