import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      return alert("Please fill in all fields");
    }
    setLoading(true);
    try {
      const res = await fetch(
        "https://studybuddy-back.onrender.com/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Registration failed");
      } else {
        alert("Registration successful! You can now log in.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4A90E2 0%, #50E3C2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Animated Circles */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.15)",
        }}
      />
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "15%",
          right: "15%",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "80%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.12)",
        }}
      />

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ zIndex: 2, width: "100%", maxWidth: 450 }}
      >
        <Container>
          <Box
            p={5}
            borderRadius={3}
            boxShadow={6}
            sx={{
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              color: "#333",
            }}
          >
            <Typography
              variant="h4"
              mb={3}
              align="center"
              sx={{
                fontWeight: "bold",
                color: "#4A90E2",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Create Account
            </Typography>

            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
              select
              label="Role"
              fullWidth
              margin="normal"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="student">Student</MenuItem>
            </TextField>

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.2,
                backgroundColor: "#4A90E2",
                fontWeight: "bold",
                borderRadius: "50px",
                "&:hover": { backgroundColor: "#357ABD" },
              }}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>

            <Button
              fullWidth
              sx={{
                mt: 2,
                color: "#4A90E2",
                textTransform: "none",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>
          </Box>
        </Container>
      </motion.div>

      {/* Footer */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          textAlign: "center",
          width: "100%",
          opacity: 0.85,
          color: "#fff",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} StudyBuddy
        </Typography>
      </Box>
    </Box>
  );
}
