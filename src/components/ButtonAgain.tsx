import "./ButtonAgain.less";
import { useState } from "react";
import { Button } from "antd-mobile";
import type { ButtonProps } from "antd-mobile";

// 自定义 onClick 类型，让它支持返回 Promise
interface ButtonAgainProps extends Omit<ButtonProps, "onClick"> {
  onClick?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    others?: any,
  ) => void | Promise<void>;
}

export default function ButtonAgain(props: ButtonAgainProps) {
  let { children, onClick: handle, ...restProps } = { ...props };
  let [loading, setLoading] = useState(false);

  // 防抖处理等待事件处理完后才能再次点击
  const clickHandle = async () => {
    if (!handle) return;
    setLoading(true);
    try {
      await handle();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button {...restProps} loading={loading} onClick={clickHandle}>
      {children}
    </Button>
  );
}
