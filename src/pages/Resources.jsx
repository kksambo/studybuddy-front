import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Grid } from "@mui/material";

const Resources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    // Fetch resources from backend
    fetch("https://studybuddy-back.onrender.com/resources")
      .then((res) => res.json())
      .then((data) => setResources(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Available Resources
      </Typography>
      <Grid container spacing={2}>
        {resources.map((res) => (
          <Grid item xs={12} sm={6} md={4} key={res.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{res.title}</Typography>
                <Typography>{res.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Resources;
