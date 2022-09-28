import { Box } from "@mui/system";
import React, { useEffect, useState, useContext } from "react";
import {
  DataGrid,
  GridColDef,
  GridValidRowModel,
  GridEventListener,
} from "@mui/x-data-grid";
import api from "../../utils/api";
import { Typography } from "@mui/material";
import ResendMessage from "./ResendMessage";
import { ContextApi } from "../Layout/Layout";
import SendMessage from "./SendMessage";

type MessageTableDataProp = {
  _id: string;
  reader_id: {
    user_name: string;
    _id: string;
  };
  content: string;
  sender_id: {
    user_name: string;
    _id: string;
  };
}[];

type newMessage = {
  _id: string;
  reader_id: {
    user_name: string;
    _id: string;
  };
  content: string;
  sender_id: {
    user_name: string;
    _id: string;
  };
};

type SendMassageProps = {
  socket: any;
};

function ReceivedMessage({ socket }: SendMassageProps) {
  const [messageTableData, setMessageTableData] =
    useState<MessageTableDataProp>([]);
  const [resendMessageVisible, setResendMessageVisible] =
    useState<boolean>(false);

  const [rowMessage, setRowMessage] = useState<newMessage | {}>({});
  const { sendMessageVisible }: any = useContext(ContextApi);

  const messageTableColumn: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        return <span>{params.row.sender_id.user_name}</span>;
      },
    },
    {
      field: "content",
      headerName: "Message",
      minWidth: 150,
      flex: 1,
      sortable: false,
    },
  ];

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    setRowMessage(params.row);
    setResendMessageVisible(true);
  };

  const getMessageList = () => {
    api
      .get("/message")
      .then((res) => {
        console.log(res);
        setMessageTableData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getMessageList();
  }, []);

  useEffect(() => {
    localStorage.setItem("messageTableData", JSON.stringify(messageTableData));
  });

  useEffect(() => {
    socket.on("receive-message", (data: newMessage) => {
      let cloneMessageTableData = JSON.parse(
        localStorage.getItem("messageTableData") || "{}"
      );
      setMessageTableData([data, ...cloneMessageTableData]);
    });
    return () => {
      socket.off("receive-message");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Typography variant="body1" className="mb-2 ml-1">
        all messages sent to you
      </Typography>
      <DataGrid
        rows={messageTableData}
        columns={messageTableColumn}
        pageSize={5}
        disableSelectionOnClick
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row: GridValidRowModel) => row._id}
        onRowClick={handleRowClick}
      />
      {resendMessageVisible ? (
        <ResendMessage
          visible={resendMessageVisible}
          setVisible={setResendMessageVisible}
          socket={socket}
          rowMessage={rowMessage}
        />
      ) : null}
      {sendMessageVisible ? <SendMessage socket={socket} /> : null}
    </Box>
  );
}

export default ReceivedMessage;
