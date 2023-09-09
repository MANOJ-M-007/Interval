import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Grid,
  Typography,
  Box,
  TextField,
  Input,
  DialogContent,
  InputLabel,
  DialogActions,
  DialogTitle,
  IconButton,
} from "@mui/material";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import {
  showSuccessNotification,
  showErrorNotification,
  //   showMessage,
} from "./Notification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTaskContext } from "../Util/TaskContext";
import { axiosInstance } from "../ApiCalls/axios";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
const List = () => {
  const { contextUpdated } = useTaskContext();

  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [image, setimage] = useState([]);
  const [id, setId] = useState("");
  const [dataUpdated, setDataUpdated] = useState(false); // for rerender purpose
  const [priorityFilter, setPriorityFilter] = useState("All"); // Add priority
  //for single view
  const [viewTaskOpen, setViewTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  // image conversion to Base 64
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

  // Single view of tasks
  const handleOpenSingle = (id) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      setSelectedTask(task);
      setViewTaskOpen(true);
    }
  };

  const handleCloseViewTask = () => {
    setSelectedTask(null);
    setViewTaskOpen(false);
  };

  // Update functions
  const handleOpen = (id) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      setHeading(task.heading);
      setDescription(task.description);
      setId(task.id);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleUpdate = async () => {
    try {
      const result = await axiosInstance.post(`/tasks/updateTask/${id}`, {
        heading,
        description,
        date,
        time,
        image,
      });
      console.log(result.data);
      showSuccessNotification(result.data.message);
      handleClose();
    } catch (error) {
      showErrorNotification(error);
      console.error("Error updating task:", error);
    }
  };

  // Delete functions
  const deleteTask = async (id) => {
    try {
      console.log(id);
      const result = await axiosInstance.delete(`/tasks/deleteTask/${id}`);
      console.log(result);
      showSuccessNotification("Task deleted successfully.");
      setDataUpdated(!dataUpdated);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  // List Tasks
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks/listTasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Set filter Actions
  const handlePriorityFilterChange = (event) => {
    setPriorityFilter(event.target.value);
  };
  const filteredTasks =
    priorityFilter === "All"
      ? tasks 
      : tasks.filter((task) => task.priority === priorityFilter);
  useEffect(() => {
    fetchTasks();
  }, [dataUpdated, contextUpdated]);

  return (
    <>
      <ToastContainer />
      {/* Dialog box for single view */}
      <Dialog open={viewTaskOpen} onClose={handleCloseViewTask}>
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
          VIEW TASK
        </DialogTitle>
        <DialogContent>
          {selectedTask && (
            <>
              {/* Display the task details, including the image */}
              <Avatar
                variant="square"
                src={selectedTask.image}
                sx={{
                  width: {
                    xs: "180px",
                    sm: "215px",
                    md: "250px",
                    lg: "290px",
                  },
                  height: {
                    xs: "180px",
                    sm: "215px",
                    md: "250px",
                    lg: "290px",
                  },
                }}
              />
              <Typography variant="h6">
                Heading: {selectedTask.heading}
              </Typography>
              <Typography>Description: {selectedTask.description}</Typography>
              <Typography>Date: {selectedTask.date}</Typography>
              <Typography>Time: {selectedTask.time}</Typography>

              <Button onClick={handleCloseViewTask} color="primary">
                Close
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* dailog box for edit tasks */}

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
          EDIT YOUR TASKS
        </DialogTitle>

        <form onSubmit={handleUpdate}>
          <DialogContent>
            <TextField
              name="title"
              label="title"
              defaultValue={heading}
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              name="description"
              label="description"
              defaultValue={description}
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

      {/* Add a button group for priority filter */}
      
      <Typography
        sx={{
          backgroundImage: "linear-gradient(to right, #28536B, #7EA8BE)",
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
        Choose Priority
      </Typography>
      <ToggleButtonGroup
        aria-label="priority-filter"
        name="priority-filter"
        value={priorityFilter}
        onChange={handlePriorityFilterChange}
        exclusive
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {["All", "Low", "Medium", "High"].map((value) => (
          <ToggleButton
            key={value}
            value={value}
            style={{
              transform: priorityFilter === value ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.2s ease-in-out",
              height: "30px",
              backgroundColor: priorityFilter === value ? "#000" : "#ddd", 
              color: priorityFilter === value ? "#fff" : "#000", 
              boxShadow:
                priorityFilter === value
                  ? "1px 2px 5px rgba(67, 68, 82)"
                  : "none", 
            }}
          >
            {value}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/*cards starts here */}

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        <Grid container spacing={2}>
          {filteredTasks.length === 0 ? (
            <Typography
              sx={{
                fontFamily: "monospace",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#757590",
                marginBottom: "0.5rem",
                marginTop: "40px",
                textAlign: "center",
                width: "100%",
              }}
              variant="h6"
              color="textSecondary"
            >
              {priorityFilter === "All"
                ? "No tasks are available "
                : `No tasks are available in ${priorityFilter} priority`}{" "}
            </Typography>
          ) : (
            filteredTasks.map((value) => (
              <Grid item xs={12} lg={6} key={value.id}>
                <Card
                  sx={{
                    width: { lg: "435", md: "435" },
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                      md: "column",
                      xl: "row",
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        variant="square"
                        src={value.image}
                        sx={{
                          width: {
                            xs: "100px",
                            sm: "190px",
                            md: "200px",
                            lg: "200px",
                          },
                          height: {
                            xs: "100px",
                            sm: "190px",
                            md: "200px",
                            lg: "200px",
                          },
                          borderRadius: "10%",
                        }}
                      />
                    }
                  />
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      p: { xs: 1, md: 1 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", lg: "row" },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "100%", md: "100%" },
                          mb: { xs: 2, md: 2 },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "revert",
                            fontSize: "1.25rem",
                            fontWeight: 800,
                            color: "#757575",
                            marginBottom: "0.5rem",
                          }}
                          variant="h6"
                          color="textSecondary"
                          component="p"
                        >
                          Heading :{value.heading}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Description :{value.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Date :{value.date}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Time :{value.time}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Priority :{value.priority}
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Button
                            sx={{
                              color: "#000000",
                              backgroundColor: "#C2FFC8",
                              boxShadow: "5px 5px 15px rgba(191, 215, 234,1)",
                              width: "100px",
                              marginRight: "2.5px",
                            }}
                            onClick={() => {
                              handleOpen(value.id);
                            }}
                          >
                            EDIT
                          </Button>
                          <Button
                            sx={{
                              color: "#000000",
                              backgroundColor: "#C2C2C1",
                              boxShadow: "5px 5px 15px rgba(191, 215, 234,1)",
                              width: "100px",
                              marginLeft: "5px",
                              cursor: "auto",
                            }}
                            onClick={() => deleteTask(value.id)}
                          >
                            DELETE
                          </Button>
                          <IconButton
                            sx={{
                              boxShadow: "1px 1px 5px rgb(66, 105, 213)",
                              marginLeft: "8px",
                              color: "#7770FF",
                            }}
                            onClick={() => handleOpenSingle(value.id)}
                          >
                            <ZoomOutMapIcon />
                          </IconButton>
                        </div>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </>
  );
};

export default List;
