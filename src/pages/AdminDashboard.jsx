import React, { useState, useEffect } from "react";
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
  Modal,
  Backdrop,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState("dashboard");

  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://studybuddy-back.onrender.com/auth/");
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item || {});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      let url = editingItem
        ? `https://studybuddy-back.onrender.com/auth/${editingItem.id}`
        : "https://studybuddy-back.onrender.com/auth/";
      let method = editingItem ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      fetchUsers();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`https://studybuddy-back.onrender.com/auth/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  const renderTable = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openModal()}
        >
          Add
        </Button>
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => openModal(user)}
                  />
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(user.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );

  const renderContent = () => {
    switch (selected) {
      case "dashboard":
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              StudyBuddy
            </Typography>
            <Typography paragraph>
              Welcome to StudyBuddy! Here, you can manage users and help
              everyone stay organized, motivated, and on track with their
              studies.
            </Typography>
            <Typography paragraph>
              Keep your study community thriving by monitoring users, assisting
              them when needed, and ensuring that learning is always fun and
              effective.
            </Typography>
          </Box>
        );
      case "users":
        return renderTable();
      default:
        return null;
    }
  };

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        StudyBuddy Admin
      </Typography>
      <Divider />
      <List>
        {[
          { text: "Dashboard", key: "dashboard", icon: <DashboardIcon /> },
          { text: "Users", key: "users", icon: <GroupIcon /> },
        ].map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={selected === item.key}
              onClick={() => setSelected(item.key)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
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
          <Typography variant="h6" noWrap>
            Admin Dashboard
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
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
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
        {renderContent()}

        <Modal
          open={modalOpen}
          onClose={closeModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={modalOpen}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: 24,
                p: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h6">
                {editingItem ? "Edit" : "Add"} User
              </Typography>
              <TextField
                label="Email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
              />
              <TextField
                label="Role"
                name="role"
                value={formData.role || ""}
                onChange={handleChange}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password || ""}
                onChange={handleChange}
              />
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={closeModal}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
  );
}
