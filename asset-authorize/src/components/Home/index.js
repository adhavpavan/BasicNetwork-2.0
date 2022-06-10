import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import APIClient from "../../api/APIClient";
import CreateAnAsset from "../Modal/CreateAnAsset";
import QueryAnAsset from "../Modal/QueryAnAsset";
import HistoryAssetTable from "../Table/HistoryAssetTable";
import QueryAllAssetTable from "../Table/QueryAllAssetTable";
import QueryAnAssetTable from "../Table/QueryAnAssetTable";

const TableRow = ({ data, setData }) => {
  switch (data.name) {
    case "query an asset":
      return <QueryAnAssetTable data={data.data} />;
    case "query all asset":
      return <QueryAllAssetTable data={data.data} setData={setData} />;
    case "history asset":
      return <HistoryAssetTable data={data.data} asset={data.asset} />;
    default:
      return <></>;
  }
};

const Home = () => {
  const [showQueryAnAsset, setShowQueryAnAsset] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    if (!localStorage.getItem("token")) window.open("./register", "_self");
  }, []);

  useEffect(() => {
    handleQueryAllAsset();
  }, []);

  const handleQueryAllAsset = () => {
    APIClient.queryAllAsset().then((rs) => {
      if (rs.data.error !== "undefine")
        setData({
          name: "query all asset",
          data: rs.data,
        });
    });
  };

  return (
    <>
      <div className="home-component">
        <div className="nav-bar">
          <Button
            className="option"
            variant="light"
            onClick={() => setShowQueryAnAsset(true)}
          >
            Query an Asset
          </Button>
          <Button
            className="option"
            variant="light"
            onClick={() => handleQueryAllAsset()}
          >
            Query all Asset
          </Button>
          <Button
            className="option"
            variant="light"
            onClick={() => setShowCreateModal(true)}
          >
            Create an Asset
          </Button>
        </div>
        <TableRow data={data} setData={setData} />
      </div>
      <QueryAnAsset
        show={showQueryAnAsset}
        handleClose={() => setShowQueryAnAsset(false)}
        setData={setData}
      />
      <CreateAnAsset
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
      />
    </>
  );
};

export default Home;
