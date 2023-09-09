import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Input,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  showSuccessNotification,
  showErrorNotification,
  showMessage,
} from "./Notification";
import { useTaskContext } from "../Util/TaskContext";
import { axiosInstance } from "../ApiCalls/axios";

const Home = () => {
  const { updateContext } = useTaskContext();
  ////dailog
  const [open, setOpen] = useState(false);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("");
  const [image, setimage] = useState([]);

  const resetHandler = () => {
    setHeading("");
    setDescription("");
    setDate("");
    setTime("");
    setimage([]);
    setPriority("");
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    resetHandler();
    setOpen(false);
  };

  //image pic
  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setimage(reader.result);
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !heading ||
      !description ||
      !date ||
      !time ||
      !image.length ||
      !priority
    ) {
      showMessage("Please fill in all required fields.");
      return;
    } else {
      try {
        const response = await axiosInstance.post("/tasks/addTask", {
          heading,
          description,
          date,
          time,
          priority,
          image,
        });

        if (response.data.message) {
          showSuccessNotification(response.data.message);
          updateContext();
        } else {
          showErrorNotification("Task creation failed.");
        }
      } catch (error) {
        showErrorNotification(error);
      }
    }
    resetHandler();
    handleClose();
  };

  return (
    <>
      <ToastContainer />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          sx={{
            backgroundImage: "linear-gradient(to right, #AD85FF, #C452BE)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginTop: "10px",
            fontFamily: "monospace",
            fontSize: "1.25rem",
            fontWeight: 800,
            marginBottom: "0.5rem",
            paddingLeft: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          ADD TASKS HERE
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              name="title"
              label="title"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              name="description"
              label="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Grid item xs={12}>
              <InputLabel sx={{ marginTop: "5px" }} htmlFor="upload-image">
                Upload image
              </InputLabel>
              <Input
                onChange={handleImage}
                type="file"
                id="upload-image"
                name="uploadImage"
                fullWidth
                autoComplete="upload-image"
                sx={{
                  height: "55px",
                  borderRadius: "4px",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  "&:hover": {
                    border: "1px solid rgba(0, 0, 0, 0.5)",
                  },
                }}
              />
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: "12px" }}>
              <Grid item xs={12} sm={6}>
                <Input
                  type="date"
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  type="time"
                  onChange={(e) => setTime(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ marginTop: "12px" }}>
              <Typography >Task Priority : {priority}</Typography>
              <RadioGroup
                aria-label="options"
                name="options"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                row
                sx={{justifyContent:'center'}}
              >
                <FormControlLabel
                  value="Low"
                  control={<Radio />}
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Low
                    </div>
                  }
                />
                <FormControlLabel
                  value="Medium"
                  control={<Radio />}
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Medium
                    </div>
                  }
                />
                <FormControlLabel
                  value="High"
                  control={<Radio />}
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      High
                    </div>
                  }
                />
              </RadioGroup>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "1",
          marginTop: "80px",
        }}
      >
        <Typography
          sx={{
            color: "#000000",
            marginBottom: "5px",
            margin: "10px",
            fontFamily: "monospace",
            marginRight: "20px",
          }}
        >
          ADD YOUR TASKS
        </Typography>
        <Button
          variant="contained"
          sx={{
            color: "#000000",
            backgroundColor: "#C2C2C2",
            boxShadow: "1px 2px 5px rgba(190, 133, 255,1)",
            width: "70px",
          }}
          onClick={handleOpen}
        >
          ADD
        </Button>
      </Box>
    </>
  );
};

export default Home;
