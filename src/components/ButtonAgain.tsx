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
  console.log("这里有handle");
  console.log(handle); //

  let [loading, setLoading] = useState(false);

  const clickHandle = async () => {
    console.log("为什么这里是undefined");
    console.log(handle);

    if (!handle) return;
    setLoading(true);
    try {
      // if (!handle) return;
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
