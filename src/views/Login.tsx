import { queryNewsBefore } from "../api";

async function oi() {
  const data = await queryNewsBefore(20211022);
  console.log(data);
}
const Login = function Login() {
  return (
    <div className="login-box">
      登录
      <button onClick={oi}>获得数据</button>
    </div>
  );
};
export default Login;
