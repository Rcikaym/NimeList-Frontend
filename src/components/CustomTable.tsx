// components/CustomTable.tsx
import React, { useState } from "react";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { TableCurrentDataSource } from "antd/es/table/interface";
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
const getColumnSearchProps = (dataIndex: string): ColumnType<any> => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => confirm()}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => clearFilters && clearFilters()}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      .toString()
      .toLowerCase()
      .includes(value.toString().toLowerCase()),
});

const CustomTable = <T extends object>({
  data,
  columns,
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
      }}
      bordered
      onChange={onChange}
      rowKey={(record) => (record as any).id || (record as any).key} // Sesuaikan berdasarkan struktur data
    />
  );
};

export { CustomTable, getColumnSearchProps };
