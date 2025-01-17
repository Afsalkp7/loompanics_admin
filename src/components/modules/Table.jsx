import { Table } from 'antd';

const CustomTable = ({ columns, data, pagination = true, loading = false }) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={pagination}
      loading={loading}
      rowKey={(record) => record.key || record.id || JSON.stringify(record)}
      bordered
    />
  );
};

export default CustomTable;
