import NavBarAgain from "../components/NavBarAgain";
import ButtonAgain from "../components/ButtonAgain";
import { useState } from "react";
import { Form, Input, Toast } from "antd-mobile";
import "./Login.less";
const Login = function Login() {
  const [FormIns] = Form.useForm(),
    [disabled, setDisabled] = useState<boolean>(false),
    [sendText, setSendText] = useState<string>("发送验证码");
  // 返回的是数组包裹的对象因此需要展开

  // 自定义表单校验规则
  const validate = {
    phone(_: any, value: string) {
      value = value.trim();
      let reg = /^(?:(?:\+|00)86)?1\d{10}$/;
      if (value.length === 0)
        return Promise.reject(new Error("手机号是必填项"));
      if (!reg.test(value)) return Promise.reject(new Error("手机号格式有误"));
      return Promise.resolve();
    },
    code(_: any, value: string) {
      value = value.trim();
      let reg = /^\d{6}$/;
      if (value.length === 0)
        return Promise.reject(new Error("验证码是必填项"));
      if (!reg.test(value)) return Promise.reject(new Error("验证码格式有误"));
      return Promise.resolve();
    },
  };
  type valuesType = {
    phone: string;
    code: string;
  };
  // 表单提交
  const submit = async (values: valuesType) => {
    try {
      const timer = setTimeout(() => {
        console.log("ciallo");
      }, 1000);
      let oi = new Promise(() => timer);
      await oi;
    } catch (error) {}
  };
  // 发送验证码
  const send = async () => {
    try {
      console.log("发送验证码");

      await FormIns.validateFields(["phone"]); //校验手机号是否正确
    } catch (error) {}
  };
  return (
    <div className="login-box">
      <NavBarAgain title="登录/注册" />
      <Form
        layout="horizontal"
        style={{ "--border-top": "none" }}
        initialValues={{ phone: "", code: "" }}
        onFinish={submit}
        footer={
          <ButtonAgain color="primary" type="submit">
            提交
          </ButtonAgain>
        }
        form={FormIns}
        requiredMarkStyle={"none"}
        // 去除必选前面的*号(内置的校验)
      >
        <Form.Item
          name="phone"
          label="手机号"
          rules={[{ validator: validate.phone }]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item
          name="code"
          label="验证码"
          // rules={[{ validator: validate.code }]}
          rules={[
            { required: true, message: "验证码是必填项" },
            {
              pattern: /^d{6}$/,
              message: "验证码格式错误",
            },
          ]}
          extra={
            <ButtonAgain
              size="small"
              color="primary"
              disabled={disabled}
              onClick={send}
            >
              {sendText}
            </ButtonAgain>
          }
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
