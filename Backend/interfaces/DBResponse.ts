interface DBResponse {
  result: boolean;
  msg?: string;
  code?: number;
  data?: object | object[];
}
export default DBResponse;
