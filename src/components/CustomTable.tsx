"use client";

import React, { useState } from "react";
import { Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type {
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import { ColumnType } from "antd/es/table";
import { FilterDropdownProps } from "antd/es/table/interface";

interface CustomTableProps<T> {
  data: T[];
  loading?: boolean;
  columns: ColumnsType<T>;
  pagination?: false | TablePaginationConfig;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, any>,
    sorter: any,
    extra: TableCurrentDataSource<T>
  ) => void;
}

// Fungsi untuk membuat filter pencarian di kolom tabel
const getColumnSearchProps = (
  dataIndex: string,
  setSearchText: (value: string) => void
): ColumnType<any> => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) => {
    const [searchValue, setSearchValue] = useState<string>("");

    const handleSearch = (value: string) => {
      setSelectedKeys(value ? [value] : []);
      setSearchText(value);
      confirm(); // Konfirmasi pencarian setelah memasukkan teks
    };

    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={(e) => {
            handleSearch(searchValue); // Ambil nilai dari input
          }}
          style={{ display: "block" }}
        />
      </div>
    );
  },
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
});

const CustomTable = <T extends object>({
  data,
  columns,
  pagination,
  onChange,
}: CustomTableProps<T>) => {
  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={{
        pageSize: pageSize,
        pageSizeOptions: ["10", "20", "50", "100"],
        showSizeChanger: true,
        onShowSizeChange: handlePageSizeChange,
        ...pagination,
      }}
      bordered
      onChange={onChange}
      rowKey={(record) => (record as any).id || (record as any).key} // Sesuaikan berdasarkan struktur data
    />
  );
};

export { CustomTable, getColumnSearchProps };
