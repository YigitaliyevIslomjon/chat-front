import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridSelectionModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Swal from "sweetalert2";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import moment from "moment";

type userTableType = {
  name: String;
  email: String;
  status: String;
  signIn_at: Date;
  signUp_at: Date;
}[];

function User() {
  const [userTableData, setUserTableData] = useState<userTableType>([]);
  const [userIdList, setUserIdList] = useState<GridSelectionModel>([]);
  const [userTableLoading, setUserTableLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const userTableColumn: GridColDef[] = [
    // { field: "_id", headerName: "Id", maxWidth: 150, flex: 1, sortable: false },

    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
      sortable: false,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 150,

      flex: 1,
      sortable: false,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,

      flex: 1,
      sortable: false,
    },
    {
      field: "sign_in_at",
      headerName: "Last login time",
      description: "This column has a value getter and is not sortable.",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params: any) => (
        <div>{moment(params.row.sign_in_at).format("DD-MM-YYYY HH:MM")}</div>
      ),
    },
    {
      field: "sign_up_at",
      headerName: "Registration time",
      description: "This column has a value getter and is not sortable.",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params: any) => (
        <div>{moment(params.row.sign_up_at).format("DD-MM-YYYY HH:MM")}</div>
      ),
    },
  ];

  const unblockUserLoogin = () => {
    setUserTableLoading(true);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .put("user/unblock", { userIdList })
          .then((res) => {
            console.log(res);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Your work has been saved",
              showConfirmButton: false,
              timer: 1000,
            });
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setUserTableLoading(false);
            setUserIdList([]);
          });
      }
    });
  };
  const blockUserLogin = () => {
    setUserTableLoading(true);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .put("user/block", { userIdList })
          .then((res) => {
            if (res.data.isValidUser) {
              navigate("/sign-in");
            }
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Your work has been saved",
              showConfirmButton: false,
              timer: 1000,
            });
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setUserTableLoading(false);
            setUserIdList([]);
          });
      }
    });
  };
  const deleteSelectUser = () => {
    setUserTableLoading(true);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete("user", { data: { userIdList } })
          .then((res) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Your work has been saved",
              showConfirmButton: false,
              timer: 1000,
            });
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setUserTableLoading(false);
            setUserIdList([]);
          });
      }
    });
  };

  const selectUserIdList = (data: GridSelectionModel) => {
    setUserIdList(data);
    console.log(data);
  };

  const setUserList = (pageNumber: any, pageSize: any) => {
    setUserTableLoading(true);
    api
      .get("user", { params: { pageNumber, pageSize } })
      .then((res) => {
        setUserTableData(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setUserTableLoading(false);
      });
  };

  useEffect(() => {
    setUserList(1, 10);
  }, []);

  const toolBarContent = () => {
    return (
      <div className="flex justify-end my-3 pr-5 gap-x-2 items-center">
        <Button onClick={blockUserLogin} variant={"contained"} className="">
          Block
        </Button>
        <LockOpenIcon onClick={unblockUserLoogin} className="cursor-pointer" />
        <DeleteIcon onClick={deleteSelectUser} className="cursor-pointer" />
      </div>
    );
  };

  return (
    <div>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={userTableData}
          columns={userTableColumn}
          pageSize={5}
          loading={userTableLoading}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={selectUserIdList}
          selectionModel={userIdList}
          components={{
            Toolbar: toolBarContent,
          }}

          getRowId={(row: GridValidRowModel) => row._id}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </div>
  );
}

export default User;
