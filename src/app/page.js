"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Table, Tag, Typography } from "antd";
import axios from "axios";
const { Text, Title } = Typography;
const columns = [
  {
    title: "ProductName",
    dataIndex: "productname",
    sorter: (a, b) => a.productname - b.productname,
    width: "30%",
  },
  {
    title: "Category",
    dataIndex: "category",
    sorter: (a, b) => a.category - b.category,
  },
  {
    title: "Record count",
    dataIndex: "record_count",
    sorter: (a, b) => a.record_count - b.record_count,
  },
  {
    title: "Address",
    dataIndex: "address",
    filters: [
      {
        text: "London",
        value: "London",
      },
      {
        text: "New York",
        value: "New York",
      },
    ],
    onFilter: (value, record) => record.address.startsWith(value),
    filterSearch: true,
    width: "40%",
  },
  {
    title: "Field list",
    key: "field_list",
    dataIndex: "field_list",
    render: (tags) => (
      <span>
        {tags.map((tag) => {
          let color = "green";
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const Product = () => {
  const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
  const router = useRouter();
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async (token) => {
    try {
      const response = await axios.get(`${apiURL}/product`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        const result = response.data.map((x) => ({ ...x, key: x.id }));
        setData(result);
        setTableData(result);
        console.log(response);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (search) {
      const filterData = data.filter(
        (x) => x.productname.includes(search) || x.category.includes(search)
      );
      setTableData(filterData);
    } else {
      setTableData(data);
    }
  }, [search]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData(token);
  }, []);

  const styles = {
    container: {
      margin: "0 auto",
      width: "90%",
    },
  };

  return (
    <div className="App">
      <div style={styles.container}>
        <div>
          <Title>Product</Title>
        </div>
        <div style={{ width: "200px" }}>
          Search: <Input onChange={(e) => setSearch(e.target.value)} />
        </div>

        <Table columns={columns} dataSource={tableData} onChange={onChange} />
      </div>
    </div>
  );
};

export default Product;
