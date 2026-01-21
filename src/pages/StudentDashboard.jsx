import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Modal,
  CircularProgress,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const drawerWidth = 240;

export default function StudentDashboard({ setUser }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState("share");
  // Scan Notes states
  const [scanImage, setScanImage] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState("");
  // Camera states
  const videoReff = useRef(null);
  const canvasRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  // Suggested Videos Modal
  const [videosModalOpen, setVideosModalOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // Share Material states
  const [moduleSearch, setModuleSearch] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [file, setFile] = useState(null);

  // My Notes states
  const [notes, setNotes] = useState([]);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteFile, setNoteFile] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // Watch Video states
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);

  // Chat bot states
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  // Timetable states
  const [timetableEvents, setTimetableEvents] = useState([]);
  const [timetableModalOpen, setTimetableModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const [menuChosen, setMenuChosen] = useState(false);

  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          sender: "bot",
          message:
            "👋 Hi! I am your StudyBuddy Tutor.\n\n" +
            "I can help you with:\n" +
            "1️⃣ Explain a concept\n" +
            "2️⃣ Examples & practice\n" +
            "3️⃣ Summarise a topic\n" +
            "4️⃣ Other\n\n" +
            "Reply with 1, 2, 3 or 4",
        },
      ]);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoReff.current.srcObject = stream;
      setCameraOpen(true);
    } catch (err) {
      alert("Camera access denied");
    }
  };

  const stopCamera = () => {
    const stream = videoReff.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraOpen(false);
  };
  const capturePhoto = () => {
    const video = videoReff.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "camera-note.png", {
        type: "image/png",
      });
      setScanImage(file);
      stopCamera();
    });
  };

  //scan handler

  const scanNotesImage = async () => {
    if (!scanImage) {
      alert("Please select or take a photo");
      return;
    }

    setScanLoading(true);
    setScanResult(null);
    setScanError("");

    const formData = new FormData();
    formData.append("image", scanImage);

    try {
      const email = user?.email || "a@a.com";

      const res = await fetch(
        `https://studybuddy-back.onrender.com/studybuddy/notes-from-handwritten-image?email=${email}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) throw new Error("Scan failed");

      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      console.error(err);
      setScanError("Failed to scan notes. Please try again.");
    } finally {
      setScanLoading(false);
    }
  };

  // Scroll chat to bottom
  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [chatMessages]);

  // Scroll to selected video
  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedVideo]);

  // Fetch PDFs
  const fetchPdfs = async () => {
    try {
      let url =
        "https://studybuddy-back.onrender.com/student-resources/resources/module";
      
      const res = await fetch(url);
      const data = await res.json();
      setPdfs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch materials");
    }
  };

  // Fetch Notes
  const fetchNotes = async () => {
    try {
      const userId = user?.id;
      if (!userId) return;
      const res = await fetch(
        `https://studybuddy-back.onrender.com/notes/${userId}`,
      );
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch notes");
    }
  };

  // Fetch Videos
  const fetchVideosForNote = async (noteId) => {
    if (!noteId) return;
    setLoadingVideos(true);
    setSelectedVideo(null);
    setVideos([]);
    try {
      const res = await fetch(
        `https://studybuddy-back.onrender.com/suggest/suggested-videos/${noteId}`,
      );
      const data = await res.json();
      setVideos(data);
      if (data.length > 0) setSelectedVideo(data[0]);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch videos");
    } finally {
      setLoadingVideos(false);
    }
  };

  // Upload Material
  const uploadMaterial = async () => {
    if (!title || !moduleName || !file) {
      alert("Please fill all fields and select a file");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("module_name", moduleName);
    formData.append("file", file);

    try {
      const res = await fetch(
        "https://studybuddy-back.onrender.com/student-resources/",
        {
          method: "POST",
          body: formData,
        },
      );
      if (!res.ok) throw new Error("Upload failed");
      alert("Material uploaded successfully!");
      setTitle("");
      setModuleName("");
      setFile(null);
      setModalOpen(false);
      fetchPdfs();
    } catch (err) {
      console.error(err);
      alert("Failed to upload material");
    }
  };

  // Upload Note
  const uploadNote = async () => {
    if (!noteTitle || !noteFile) {
      alert("Please fill note name and select a file");
      return;
    }
    const formData = new FormData();
    formData.append("note_name", noteTitle);
    formData.append("user_id", user?.id || "1");
    formData.append("file", noteFile);

    try {
      const res = await fetch("https://studybuddy-back.onrender.com/notes/", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      alert("Note uploaded successfully!");
      setNoteTitle("");
      setNoteFile(null);
      setNotesModalOpen(false);
      fetchNotes();
    } catch (err) {
      console.error(err);
      alert("Failed to upload note");
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await fetch(
        `https://studybuddy-back.onrender.com/notes/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Delete failed");
      fetchNotes();
      if (selectedNoteId === id) setSelectedNoteId(null);
      setVideos([]);
      setSelectedVideo(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    }
  };

  // Download PDF/Note
  const downloadFile = async (url, name) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = name;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  // Chat send
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const studentMsg = { sender: "student", message: chatInput };
    setChatMessages((prev) => [...prev, studentMsg]);
    const question = chatInput;
    setChatInput("");
    if (["1", "2", "3", "4"].includes(chatInput.trim())) {
      setMenuChosen(true);
    }

    try {
      const res = await fetch(
        "https://studybuddy-back.onrender.com/studybuddy/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "abcd", question }),
        },
      );
      const data = await res.json();
      const botMsg = { sender: "bot", message: data.answer };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const botMsg = { sender: "bot", message: "Sorry, something went wrong!" };
      setChatMessages((prev) => [...prev, botMsg]);
    }
  };

  // Fetch timetable events
  const fetchTimetableEvents = async () => {
    try {
      const userId = user?.id;
      if (!userId) return;

      const res = await fetch(
        `https://studybuddy-back.onrender.com/timetable/?user_id=${userId}`,
      );
      const data = await res.json();

      const events = data.map((ev) => ({
        id: ev.id,
        title: ev.title,
        start: ev.start_time,
        end: ev.end_time,
      }));

      setTimetableEvents(events);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch timetable events");
    }
  };

  // Save a new timetable event
  const saveTimetableEvent = async () => {
    if (!eventTitle || !eventDate || !eventStart || !eventEnd) {
      alert("Fill all fields");
      return;
    }

    const payload = {
      title: eventTitle,
      start_time: `${eventDate}T${eventStart}`,
      end_time: `${eventDate}T${eventEnd}`,
    };

    try {
      const userId = user?.id;
      const res = await fetch(
        `https://studybuddy-back.onrender.com/timetable/?user_id=${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error("Save failed");

      setEventTitle("");
      setEventDate("");
      setEventStart("");
      setEventEnd("");
      setTimetableModalOpen(false);

      fetchTimetableEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to save event");
    }
  };

  useEffect(() => {
    fetchPdfs();
    fetchNotes();
    fetchTimetableEvents();
  }, []);

  const sections = [
    {
      key: "share",
      title: "Share Material",
      icon: <SchoolIcon />,
      content: (
        <Box>
          {/* Share Material Section */}
          <Typography variant="h5" mb={2} sx={{ color: "#4A90E2" }}>
            Share & Access Materials
          </Typography>
          <Button
            variant="contained"
            sx={{ mb: 3, backgroundColor: "#4A90E2" }}
            onClick={() => setModalOpen(true)}
          >
            Upload Material
          </Button>

          {/* Upload Material Modal */}
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "#E1F5FE",
                borderRadius: 3,
                p: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h6">Upload Material</Typography>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
              <TextField
                label="Module Name"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                fullWidth
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button
                variant="contained"
                sx={{ backgroundColor: "#4A90E2", color: "#fff" }}
                onClick={uploadMaterial}
              >
                Upload
              </Button>
            </Box>
          </Modal>


          <Grid container spacing={3}>
            {pdfs.length > 0 ? (
              pdfs.map((pdf) => (
                <Grid item xs={12} sm={6} md={4} key={pdf.id}>
                  <Card sx={{ bgcolor: "#F5A623", borderRadius: 3 }}>
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: "#1a237e" }}
                      >
                        {pdf.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#4A90E2", display: "block", mb: 1 }}
                      >
                        {pdf.module_name}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          downloadFile(
                            `https://studybuddy-back.onrender.com/student-resources/resources/download/${pdf.id}`,
                            pdf.title,
                          )
                        }
                      >
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No materials found</Typography>
            )}
          </Grid>
        </Box>
      ),
    },
    {
      key: "myNotes",
      title: "My Notes",
      icon: <SchoolIcon />,
      content: (
        <Box>
          <Typography variant="h5" mb={2} sx={{ color: "#4A90E2" }}>
            My Notes
          </Typography>
          <Button
            variant="contained"
            sx={{ mb: 3, backgroundColor: "#4A90E2" }}
            onClick={() => setNotesModalOpen(true)}
          >
            Upload Note
          </Button>

          <Modal open={notesModalOpen} onClose={() => setNotesModalOpen(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "#E1F5FE",
                borderRadius: 3,
                p: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h6">Upload Note</Typography>
              <TextField
                label="Note Name"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                fullWidth
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setNoteFile(e.target.files[0])}
              />
              <TextField
                label="User ID"
                value={user?.id || ""}
                disabled
                fullWidth
              />
              <Button
                variant="contained"
                sx={{ backgroundColor: "#4A90E2", color: "#fff" }}
                onClick={uploadNote}
              >
                Upload
              </Button>
            </Box>
          </Modal>

          <Grid container spacing={3}>
            {notes.length > 0 ? (
              notes.map((note) => (
                <Grid item xs={12} sm={6} md={4} key={note.id}>
                  <Card
                    sx={{
                      bgcolor:
                        selectedNoteId === note.id ? "#4A90E2" : "#F5A623",
                      borderRadius: 3,
                      // cursor: "pointer",
                    }}
                    // onClick={() => {
                    //   setSelectedNoteId(note.id);
                    //   setVideosModalOpen(true);
                    //   fetchVideosForNote(note.id);
                    // }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: "#1a237e" }}
                      >
                        {note.note_name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#4A90E2", display: "block", mb: 1 }}
                      >
                        Uploaded by: {note.user_id}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            downloadFile(
                              `https://studybuddy-back.onrender.com/notes/download/${note.id}`,
                              note.note_name,
                            )
                          }
                        >
                          Download
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation(); // 🔥 VERY IMPORTANT
                            setSelectedNoteId(note.id);
                            setVideosModalOpen(true);
                            fetchVideosForNote(note.id);
                          }}
                        >
                          🎥 Watch Videos
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => deleteNote(note.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No notes found</Typography>
            )}
          </Grid>
        </Box>
      ),
    },

    {
      key: "scanNotes",
      title: "Scan Notes",
      icon: <SchoolIcon />,
      content: (
        <Box>
          <Typography variant="h5" mb={2} sx={{ color: "#4A90E2" }}>
            Scan Handwritten Notes
          </Typography>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography mb={2}>
              Take a photo using your camera or upload an image of handwritten
              notes.
            </Typography>

            {!cameraOpen && (
              <Box display="flex" gap={2} flexWrap="wrap">
                {/* <Button
                  variant="contained"
                  sx={{ backgroundColor: "#4A90E2" }}
                  onClick={startCamera}
                >
                  Open Camera
                </Button> */}

                <Button variant="outlined" component="label">
                  Upload Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => setScanImage(e.target.files[0])}
                  />
                </Button>
              </Box>
            )}

            {cameraOpen && (
              <Box mt={2}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    maxHeight: 300,
                    borderRadius: 8,
                  }}
                />
                <canvas ref={canvasRef} style={{ display: "none" }} />

                <Box display="flex" gap={2} mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={capturePhoto}
                  >
                    Capture
                  </Button>
                  <Button variant="outlined" color="error" onClick={stopCamera}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}

            {scanImage && (
              <Box mt={2}>
                <Typography variant="caption">
                  Image ready for scanning
                </Typography>
                <Box mt={1}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#4A90E2" }}
                    onClick={scanNotesImage}
                    disabled={scanLoading}
                  >
                    {scanLoading ? "Scanning..." : "Scan Notes"}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>

          {scanLoading && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          )}

          {scanResult?.success && (
            <Grid container spacing={3} mt={1}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Extracted Text</Typography>
                    <Typography whiteSpace="pre-line">
                      {scanResult.extracted_text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: "#E1F5FE" }}>
                  <CardContent>
                    <Typography variant="h6">Study Summary</Typography>
                    <Box sx={{ mt: 1 }}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {scanResult.notes}
                      </ReactMarkdown>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      ),
    },

    {
      key: "chat",
      title: "Tutor Chatbot",
      icon: <ChatIcon />,
      content: (
        <Box>
          <Typography variant="h5" mb={2} sx={{ color: "#4A90E2" }}>
            Tutor Chatbot
          </Typography>
          <Paper
            sx={{
              height: 400,
              overflowY: "auto",
              p: 2,
              mb: 2,
              border: "1px solid #4A90E2",
            }}
          >
            {chatMessages.map((msg, idx) => (
              <Box
                key={idx}
                textAlign={msg.sender === "student" ? "right" : "left"}
                mb={1}
              >
                <Paper
                  sx={{
                    display: "inline-block",
                    p: 1,
                    bgcolor: msg.sender === "student" ? "#4A90E2" : "#F5F5F5",
                    color: msg.sender === "student" ? "#fff" : "#000",
                    borderRadius: 2,
                    maxWidth: "70%",
                  }}
                >
                  {msg.message}
                </Paper>
              </Box>
            ))}
            <div ref={chatEndRef} />
          </Paper>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type 1, 2, 3 or 4 to start..."
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#4A90E2" }}
              onClick={sendChatMessage}
            >
              Send
            </Button>
          </Box>
        </Box>
      ),
    },
    {
      key: "timetable",
      title: "Personal Timetable",
      icon: <ScheduleIcon />,
      content: (
        <Box>
          <Typography variant="h5" mb={2} sx={{ color: "#4A90E2" }}>
            Personal Timetable
          </Typography>
          <Button
            variant="contained"
            sx={{ mb: 2, backgroundColor: "#4A90E2" }}
            onClick={() => setTimetableModalOpen(true)}
          >
            Add Event
          </Button>
          <Modal
            open={timetableModalOpen}
            onClose={() => setTimetableModalOpen(false)}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "#E1F5FE",
                borderRadius: 3,
                p: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h6">Add Event</Typography>
              <TextField
                label="Event Title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                fullWidth
              />
              <TextField
                label="Date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                fullWidth
              />
              <TextField
                label="Start Time"
                type="time"
                value={eventStart}
                onChange={(e) => setEventStart(e.target.value)}
                fullWidth
              />
              <TextField
                label="End Time"
                type="time"
                value={eventEnd}
                onChange={(e) => setEventEnd(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                sx={{ backgroundColor: "#4A90E2" }}
                onClick={saveTimetableEvent}
              >
                Save Event
              </Button>
            </Box>
          </Modal>

          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={timetableEvents}
            height={600}
          />
        </Box>
      ),
    },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ color: "#4A90E2" }}>
          Student Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {sections.map((section) => (
          <ListItem key={section.key} disablePadding>
            <ListItemButton
              selected={selected === section.key}
              onClick={() => setSelected(section.key)}
            >
              <ListItemIcon sx={{ color: "#4A90E2" }}>
                {section.icon}
              </ListItemIcon>
              <ListItemText primary={section.title} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon sx={{ color: "#E53935" }}>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            Welcome, {user?.name || "Student"}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {sections.find((sec) => sec.key === selected)?.content}
      </Box>
      <Modal
        open={videosModalOpen}
        onClose={() => {
          setVideosModalOpen(false);
          setSelectedVideo(null);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", md: "80%" },
            maxHeight: "90vh",
            bgcolor: "#E1F5FE",
            borderRadius: 3,
            p: 3,
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" mb={2} sx={{ color: "#4A90E2" }}>
            Suggested Videos
          </Typography>

          {loadingVideos ? (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : videos.length > 0 ? (
            <Grid container spacing={3}>
              {/* Video List */}
              <Grid item xs={12} md={4}>
                {videos.map((video, idx) => (
                  <Card
                    key={idx}
                    sx={{
                      mb: 2,
                      cursor: "pointer",
                      border:
                        selectedVideo?.url === video.url
                          ? "2px solid #4A90E2"
                          : "1px solid #ccc",
                    }}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <CardContent>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{ width: "100%", borderRadius: 6 }}
                      />
                      <Typography variant="subtitle2" mt={1}>
                        {video.title}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>

              {/* Video Player */}
              <Grid item xs={12} md={8}>
                {selectedVideo ? (
                  <>
                    <Typography variant="h6" mb={1}>
                      {selectedVideo.title}
                    </Typography>
                    <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                      <iframe
                        src={selectedVideo.url.replace("watch?v=", "embed/")}
                        title={selectedVideo.title}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: 0,
                          borderRadius: 8,
                        }}
                        allowFullScreen
                      />
                    </Box>
                  </>
                ) : (
                  <Typography>Select a video to play</Typography>
                )}
              </Grid>
            </Grid>
          ) : (
            <Typography>No suggested videos found for this note.</Typography>
          )}

          <Box mt={3} textAlign="right">
            <Button
              variant="contained"
              sx={{ backgroundColor: "#4A90E2" }}
              onClick={() => setVideosModalOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
