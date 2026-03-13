import { useState } from "react";
import NavBarAgain from "../components/NavBarAgain";
import ButtonAgain from "../components/ButtonAgain";
import { ImageUploader, Input, Toast } from "antd-mobile";
import api from "../api";
import { queryUserInfo, updateInfo } from "../store/features/baseSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import "./Update.less";
import { type ImageUploadItem } from "antd-mobile";
const Update = function Update(props: any) {
  const { info } = useAppSelector((state) => state.base);
  const [fileList, setFileList] = useState<ImageUploadItem[]>([
    {
      url: info?.pic ?? "",
    },
  ]);
  const [username, setUserName] = useState(info?.name ?? "");
  let { navigate } = props;
  const dipatch = useAppDispatch();
  /* 图片上传 */
  const limitImage = (file: File) => {
    if (file.size > 1024 * 1024) {
      Toast.show("请选择小于1m的图片");
      return null;
    }
    return file;
  };
  const uploadImage = async (file: File): Promise<ImageUploadItem> => {
    let temp = "";
    try {
      let { code, pic, codeText } = await api.uploadImage(file);
      if (+code !== 0) {
        Toast.show({
          icon: "fail",
          content: "上传失败",
        });
        return { url: "" };
      }
      temp = pic;
      setFileList([
        {
          url: pic,
        },
      ]);
    } catch (error) {}
    return { url: temp };
  };

  /* 提交信息 */
  const submit = async () => {
    // 表单校验
    if (fileList.length === 0) {
      Toast.show({
        icon: "fail",
        content: "请先上传图片",
      });
      return;
    }
    if (username.trim() === "") {
      Toast.show({
        icon: "fail",
        content: "请先输入账号",
      });
      return;
    }
    let [{ url }] = fileList;
    try {
      let obj = {
        username: username.trim(),
        pic: url,
      };
      let { code } = await api.updateUserInfo(obj);
      if (+code !== 0) {
        Toast.show({
          icon: "fail",
          content: "修改信息失败",
        });
        return;
      }
      Toast.show({
        icon: "success",
        content: "修改信息成功",
      });
      dipatch(queryUserInfo()); //同步redux中的信息
      navigate(-1);
    } catch (_) {}
  };

  return (
    <div className="updateBox">
      <NavBarAgain title="修改信息" />
      <div className="formBox">
        <div className="item">
          <div className="label">头像</div>
          <div className="input">
            <ImageUploader
              value={fileList}
              maxCount={1}
              onDelete={() => {
                setFileList([]);
              }}
              beforeUpload={limitImage}
              upload={uploadImage}
            />
          </div>
        </div>
        <div className="item">
          <div className="label">姓名</div>
          <div className="input">
            <Input
              placeholder="请输入账号名称"
              value={username}
              onChange={(val) => {
                setUserName(val);
              }}
            />
          </div>
        </div>
        <ButtonAgain color="primary" className="submit" onClick={submit}>
          提交
        </ButtonAgain>
      </div>
    </div>
  );
};
export default Update;
