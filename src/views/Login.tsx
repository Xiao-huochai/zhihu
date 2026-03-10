import NavBarAgain from "../components/NavBarAgain";
import ButtonAgain from "../components/ButtonAgain";
import { useState, useRef, useEffect } from "react";
import { Form, Input, Toast } from "antd-mobile";
import api from "../api";
import "./Login.less";
import _ from "../assets/utils";
// redux
import { useAppDispatch, useAppSelector } from "../hooks";
import { queryUserInfo, updateInfo } from "../store/features/baseSlice";
import type { RootState } from "../store";
import { useNavigate, useSearchParams } from "react-router-dom";
const Login = function Login() {
  // 返回的是数组包裹的对象因此需要展开
  const [FormIns] = Form.useForm(),
    [disabled, setDisabled] = useState<boolean>(false),
    [sendText, setSendText] = useState<string>("发送验证码"),
    // [countdownTime, setCountdownTime] = useState(0),
    timerRef = useRef<number | null>(null);

  const navigate = useNavigate();
  const [usp] = useSearchParams(); //得到问号传参
  // redux
  const dispatch = useAppDispatch();
  // const {
  //   info: userInfo,
  //   loading,
  //   error,
  // } = useAppSelector((state: RootState) => state.base);

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
  const submit = async () => {
    try {
      await FormIns.validateFields(); //什么都不传则对所有的进行校验
      // 即触发rules写的校验规则
      let { phone, code } = FormIns.getFieldsValue();
      let { code: codeHttp, token } = await api.login(phone, code);
      if (+codeHttp !== 0) {
        Toast.show({
          icon: "fail",
          content: "登录失败",
        });
        FormIns.resetFields(["code"]); //重置code
        return;
      }
      // 登录成功:存token,存储登录者信息到redux,提示，跳转
      _.storage.set("tk", token);
      Toast.show({
        icon: "success",
        content: "登录成功",
      });
      // 必须用封装好了对应类型的 否则报错
      await dispatch(queryUserInfo());
      let to = usp.get("to"); //得到问号传参的to 如果没有则跳转到上一级
      to ? navigate(to, { replace: true }) : navigate(-1);
      // await delay(3000);
    } catch (error) {}
  };
  // 发送验证码
  const send = async () => {
    try {
      await FormIns.validateFields(["phone"]); //校验手机号是否正确
      let phone = FormIns.getFieldValue("phone");
      let { code } = await api.sendPhoneCode(phone);
      if (+code !== 0) {
        Toast.show({
          icon: "fail",
          content: "发送失败",
        });
      }
      setDisabled(true);
      countdown(5);
    } catch (error) {}
  };
  const delay = (time = 1000) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), time);
    });
  };

  // 倒计时
  const countdown = (time: number = 30) => {
    // 启动前先清理可能存在的旧定时器
    clearCountdownTimer();
    // setCountdownTime(time);
    setSendText(`${time}秒后重发`);
    let remainingTime = time;
    timerRef.current = setInterval(() => {
      remainingTime -= 1;
      // 倒计时结束
      if (remainingTime === 0) {
        clearCountdownTimer();
        setSendText("发送验证码");
        setDisabled(false);
        return 0;
      }
      // 倒计时中
      setSendText(`${remainingTime}秒后重发`);
    }, 1000);
  };

  // 清理定时器的通用方法
  const clearCountdownTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 组件卸载时清理定时器，核心的安全保障
  useEffect(() => {
    return () => {
      clearCountdownTimer();
    };
  }, []);

  return (
    <div className="login-box">
      <NavBarAgain title="登录/注册" />
      <Form
        layout="horizontal"
        style={{ "--border-top": "none" }}
        initialValues={{ phone: "", code: "" }}
        // onFinish={submit}
        footer={
          <ButtonAgain color="primary" onClick={submit}>
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
              pattern: /^\d{6}$/,
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
