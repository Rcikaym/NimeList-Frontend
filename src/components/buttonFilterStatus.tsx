import { Select, Button } from 'antd';
import { useState } from 'react';

const { Option } = Select;

const StatusFilter = ({ onFilterChange }: any) => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleChange = (value: string) => {
    setSelectedStatus(value);
    onFilterChange(value); // Panggil fungsi untuk mengupdate filter
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <Select
        defaultValue={selectedStatus}
        style={{ width: 120 }}
        onChange={handleChange}
      >
        <Option value="all">All</Option>
        <Option value="success">Success</Option>
        <Option value="pending">Pending</Option>
        <Option value="failed">Failed</Option>
      </Select>
    </div>
  );
};

export default StatusFilter;
