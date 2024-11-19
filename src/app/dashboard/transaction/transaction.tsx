"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TablePaginationConfig } from "antd/es/table";
import { Input, type TableColumnsType, type TableProps } from "antd";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { AppstoreFilled, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import Link from "next/link";
import { CustomTable } from "@/components/CustomTable";
import renderDateTime from "@/components/FormatDateTime";
import useDebounce from "@/utils/useDebounce";
import { SorterResult } from "antd/es/table/interface";
import { DataType, TransactionDetails } from "./types";
import ModalDetailTransaction from "@/app/dashboard/transaction/ModalDetailTransactionComponent";
import FilterModal from "@/app/dashboard/transaction/ModalFilterTransactionComponent";
import apiUrl from "@/hooks/api";

const TransactionList = () => {
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sortOrder, setOrder] = useState<string>("ASC");
  const [searchText, setSearchText] = useState<string>("");
  const debounceText = useDebounce(searchText, 1500);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailTransaction, setDetailTransaction] = useState(
    {} as TransactionDetails
  );
  const [filterString, setFilterString] = useState("status=&premium=&platform=");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL;

  const showModalDetail = async (id: string) => {
    setModalVisible(true);
    const res = await apiUrl.get(`/transactions/get/${id}`);
    setDetailTransaction(await res.data);
  };

  const fetchTransaction = async () => {
    try {
      const response = await apiUrl.get(
        `${api}/transactions/get-admin?page=${pagination.current}&limit=${pagination.pageSize}&search=${debounceText}&${filterString}`
      );
      const { data, total } = await response.data;
      setData(data); // Mengisi data dengan hasil dari API
      setPagination({
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: total,
      });
      setLoading(false); // Menonaktifkan status loading setelah data didapat
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false); // Tetap menonaktifkan loading jika terjadi error
    }
  };

  useEffect(() => {
    fetchTransaction(); // Panggil fungsi fetchTransaction saat komponen dimuat
  }, [JSON.stringify(pagination), debounceText, filterString]);

  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination: TablePaginationConfig,
    filters,
    sorter
  ) => {
    const sortParsed = sorter as SorterResult<DataType>;
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
    setOrder(sortParsed.order === "descend" ? "DESC" : "ASC");
    console.log(sortOrder);
  };

  // Kolom table
  const columns: TableColumnsType<DataType> = useMemo(
    () => [
      {
        title: "Username",
        dataIndex: "username",
      },
      {
        title: "Order Id",
        dataIndex: "order_id",
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status: string) =>
          status === "success" ? (
            <>
              <div className="flex rounded-md bg-emerald-700 px-3 py-1 justify-center w-fit">
                <span className="text-white">Success</span>
              </div>
            </>
          ) : status === "pending" ? (
            <>
              <div className="flex rounded-md bg-yellow-600 px-3 py-1 justify-center w-fit">
                <span className="text-white">Pending</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex rounded-md bg-red-600 px-3 py-1 justify-center w-fit">
                <span className="text-white">Failed</span>
              </div>
            </>
          ),
      },
      {
        title: "Total",
        dataIndex: "total",
        render: (total: number) => (
          <span>{`Rp${new Intl.NumberFormat("id-ID").format(total)}`}</span>
        ),
      },
      {
        title: "Created At",
        dataIndex: "created_at",
        render: (start_premium: string | null) =>
          start_premium ? renderDateTime(start_premium) : "0000-00-00 00:00:00",
      },
      {
        title: "Updated At",
        dataIndex: "updated_at",
        render: (end_premium: string | null) =>
          end_premium ? renderDateTime(end_premium) : "0000-00-00 00:00:00",
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (text: string, record: DataType) => (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => showModalDetail(record.id)}
              className="bg-emerald-700 text-white items-center w-fit rounded-md px-4 py-2 flex hover:bg-emerald-800"
            >
              <EyeOutlined style={{ fontSize: 18 }} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const handleApplyFilter = (filterResult: string) => {
    setFilterString(filterResult);
  };

  return (
    <>
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <AiOutlineShoppingCart style={{ fontSize: 20 }} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg">Transaction Information</h2>
            <span>
              Displays transaction short information and transaction details
            </span>
          </div>
        </div>
        <div className="items-center flex gap-3">
          <Link href="/dashboard">
            <div className="hover:text-emerald-700">
              <AppstoreFilled style={{ fontSize: 18 }} />
            </div>
          </Link>
          <span> / </span>
          <Link href="/dashboard/users">
            <h2 className="text-lg hover:text-emerald-700 mt-2">Transaction</h2>
          </Link>
        </div>
      </div>
      <div className="flex justify-end mb-3">
        <div className="flex gap-3">
          <Input
            addonBefore={<SearchOutlined />}
            placeholder="Only user and order id"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            type="button"
            className="bg-emerald-700 text-white py-2 px-3 rounded-md hover:bg-emerald-800"
            onClick={() => setIsModalOpen(true)}
          >
            Filter
          </button>
        </div>
      </div>
      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApplyFilter}
      />
      <ModalDetailTransaction
        data={detailTransaction}
        modalVisible={modalVisible}
        handleCancel={() => setModalVisible(false)}
      />
      <CustomTable
        loading={loading}
        columns={columns}
        pagination={pagination} // Jumlah data yang ditampilkan
        onChange={handleTableChange}
        data={data} // Data dari state
      />
    </>
  );
};

export default TransactionList;
