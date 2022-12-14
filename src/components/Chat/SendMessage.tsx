import React, { useContext, useState } from "react";
import { Grid, Box, Avatar, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Autocomplete, LoadingButton } from "@mui/lab";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ContextApi } from "../Layout/Layout";
import { Controller, useForm } from "react-hook-form";
import api from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";

type MessageFormValues = {
  reader_id: string;
  content: string;
};

type Recipient = {
  user_name: string;
  _id: string;
}[];

type SendMassageProps = {
  socket: any;
};

function SendMessage({ socket }: SendMassageProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MessageFormValues>();

  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [recipientsList, setRecipientsList] = useState<Recipient>([]);
  const { sendMessageVisible, setSendMessageVisible }: any =
    useContext(ContextApi);

  const notify = (message: string) => toast(message);
  const closeDialog = () => {
    setSendMessageVisible(false);
  };
  const searchUser = (searchingUserName: any) => {
    let searchVal = searchingUserName.target.value;
    api
      .post("/user/list", { user_name: searchVal })
      .then((res) => {
        setRecipientsList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const messageUser = (body: MessageFormValues) => {
    setLoadingButton(true);
    api
      .post("/message", body)
      .then((res) => {
        console.log(res);
        setSendMessageVisible(false);
      })
      .catch((err) => {
        notify(err.response.data.error);
      })
      .finally(() => {
        setLoadingButton(false);
      });
  };

  const submitMessage = (data: MessageFormValues) => {
    messageUser(data);
    socket.emit("send-message", { reader_id: data.reader_id });
  };

  return (
    <Dialog
      open={sendMessageVisible}
      onClose={closeDialog}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="alert-dialog-title">{"write a message"}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(submitMessage)}>
          <Grid container columnSpacing={{ xs: 1 }}>
            <Grid item xs={12} className="flex flex-col gap-y-5">
              <div className="border-1">
                <div className="mb-3">Recipients</div>
                <Controller
                  control={control}
                  name="reader_id"
                  rules={{ required: "Recipient is required" }}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      autoHighlight
                      onChange={(e, value) => {
                        onChange(value?._id);
                      }}
                      getOptionLabel={(option) => {
                        return option.user_name;
                      }}
                      id="combo-box-demo"
                      options={recipientsList}
                      sx={{ width: 300 }}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Avatar alt="R">R</Avatar>

                          <span className="ml-2">{option.user_name}</span>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          onChange={searchUser}
                          multiline
                          {...params}
                          label="Recipient"
                          error={errors.reader_id ? true : false}
                          helperText={
                            errors.reader_id && errors.reader_id.message
                          }
                          placeholder="searching recipient"
                        />
                      )}
                    />
                  )}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="py-2">
                <Controller
                  control={control}
                  name="content"
                  rules={{ required: "content is required" }}
                  render={({ field: { onChange } }) => (
                    <TextField
                      onChange={onChange}
                      id="outlined-multiline-static"
                      label="write a message"
                      multiline
                      rows={4}
                      error={errors.content ? true : false}
                      helperText={errors.content && errors.content.message}
                      fullWidth
                    />
                  )}
                />
              </div>{" "}
              <LoadingButton
                type="submit"
                loading={loadingButton}
                loadingPosition="start"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                startIcon={<SendIcon />}
              >
                send
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant={"outlined"} onClick={closeDialog}>
          Cancel
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
}

export default SendMessage;
