import React from "react";
import { Container, Typography, Button, Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

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

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ textAlign: "center", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            StudyBuddy
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{
              mb: 4,
              opacity: 0.9,
              fontWeight: 300,
              fontFamily: "'Open Sans', sans-serif",
            }}
          >
            Your smart companion for notes, study materials, and learning
            resources.
          </Typography>

          <Stack
            direction="row"
            spacing={3}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#fff",
                color: "#4A90E2",
                fontWeight: "bold",
                px: 5,
                borderRadius: "50px",
                "&:hover": { backgroundColor: "#f2f2f2" },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "#fff",
                color: "#fff",
                fontWeight: "bold",
                px: 5,
                borderRadius: "50px",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
              }}
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Stack>
        </motion.div>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          textAlign: "center",
          width: "100%",
          opacity: 0.85,
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} StudyBuddy • All Rights Reserved
        </Typography>
      </Box>
    </Box>
  );
}
