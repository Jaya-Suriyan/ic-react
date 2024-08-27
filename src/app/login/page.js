"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button, Form, Grid, Input, Typography } from "antd";

import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

export default function Login() {
  const router = useRouter();
  const screens = useBreakpoint();
  const [errorMsg, setErrorMsg] = useState(null);
  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    setErrorMsg(null);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/user/login",
        values
      );
      if (response.status.toString().startsWith("2")) {
        const token = response?.data?.token;
        if (token) {
          localStorage.setItem("token", token);
          router.push("/");
        }
        return response?.data;
      } else {
        setErrorMsg("Invalid credentials");
      }
    } catch (error) {
      console.log("error", error);
      if (error.status && error.status.toString().startsWith("4")) {
        setErrorMsg(error.response.data.msg || "Invalid credentials");
      }
    }
  };

  const styles = {
    container: {
      margin: "0 auto",
      //   padding: screens.md
      //     ? `${token.paddingXL}px`
      //     : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    footer: {
      //   marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      //   marginBottom: token.marginXL,
    },
    section: {
      alignItems: "center",
      //   backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      //   padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    text: {
      //   color: token.colorTextSecondary,
    },
    title: {
      //   fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title style={styles.title}>Log in</Title>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="username"
            rules={[
              {
                type: "username",
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          {errorMsg && <Text style={{ color: "red" }}>{errorMsg}</Text>}
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block="true" type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
