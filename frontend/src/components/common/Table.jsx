import { Table } from "antd";
import React, { memo } from "react";
import Loading from "../common/Loading";

const TableComponent = (props) => {
  const { data = [], isLoading = false, columns = [] } = props;

  return (
    <Loading isLoading={isLoading}>
      <Table columns={columns} dataSource={data} {...props} />
    </Loading>
  );
};

export default memo(TableComponent);
