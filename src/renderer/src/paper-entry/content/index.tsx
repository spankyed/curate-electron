import React, { useState } from 'react';
import { Typography, Box, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, Grid, Select, 
  MenuItem, Checkbox, TextField, Button, CardMedia, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MockEntry = {
  videoTitle: 'AI Brainstorm, Process Mining Revolution, Business Superpowers Unleashed!',
  thumbnailLarge: "https://picsum.photos/200/300",
  thumbnailSmall1: "https://picsum.photos/200/300",
  thumbnailSmall2: "https://picsum.photos/200/300",
  keywords: ["Keywords", "Keywords", "Keywords"],
  description: "Description",
  videoScript: `Imagine you're driving a car. The car represents your business, and the journey represents your business processes. Now, traditionally, to navigate the journey, you'd need to understand maps, road signs, and maybe even some complex GPS equipment. This is like the traditional process mining - it's powerful, but it requires specific knowledge and skills.

  Now, imagine if your car had an advanced GPS system where you could just tell it where you want to go in plain language, and it would understand and guide you there. Not only that, but it could also understand complex requests like "find a route with the least traffic" or "find a route that passes by a gas station and a Chinese restaurant". This is what the AI in this research is doing for process mining. It's making it as easy to use as telling your GPS where you want to go.
  
  But there's more. This GPS isn't perfect. Sometimes it might not understand your request, or it might get confused by unusual road layouts. So, the researchers have developed a system to handle these situations, to correct errors, and to learn from them. This is like the AI's ability to handle complex queries, to generate meaningful responses, and to learn from its mistakes.
  
  So, in a nutshell, this research is about turning the complex map of process mining into an easy-to-use GPS system that anyone in your business can use to navigate your business processes.`,
}

export default function ContentTab() {
  const videoContent = MockEntry;
  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Metadata</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Metadata Level Content */}
          <Box>
            <TextField fullWidth label="Video Title" value={videoContent.videoTitle} sx={{ marginTop: 3}}/>
            <TextField fullWidth label="Keywords" value={videoContent.keywords} multiline sx={{ marginTop: 3, marginBottom: 3}} />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              value={videoContent.description}
              sx={{ marginTop: 3}}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Video</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Video Level Content */}
          <Box>
            <TextField
              fullWidth
              label="Script"
              multiline
              minRows={5}
              variant="outlined"
              value={videoContent.videoScript}
              sx={{ marginTop: 3}}
            />
            {/* Video Player Component */}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Thumbnail</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Thumbnail Level Content */}
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={6} container justifyContent="center">
              <Box maxWidth="1280px" width="100%">
                <CardMedia
                  component="img"
                  image={videoContent.thumbnailLarge}
                  alt="Large Thumbnail"
                  style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                />
                <Box display="flex" justifyContent="space-between" marginTop={2}>
                  <Select defaultValue={'white'}>
                    <MenuItem value="white">White</MenuItem>
                    <MenuItem value="black">Black</MenuItem>
                    {/* Add more colors if needed */}
                  </Select>
                  {/* <Checkbox /> */}
                  <FormControlLabel control={<Checkbox />} label="Seminal?" />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} container direction="column" spacing={2}>
              <Grid item container justifyContent="center">
                <Box maxWidth="640px" width="100%">
                  <Button>Reroll</Button>
                  <CardMedia
                    component="img"
                    image={videoContent.thumbnailSmall1}
                    alt="Small Thumbnail 1"
                    style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                  />
                  <TextField fullWidth label="Description"/>
                </Box>
              </Grid>
              <Grid item container justifyContent="center">
                <Box maxWidth="640px" width="100%">
                  <Button>Reroll</Button>
                  <CardMedia
                    component="img"
                    image={videoContent.thumbnailSmall2}
                    alt="Small Thumbnail 2"
                    style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                  />
                  <TextField fullWidth label="Description"/>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
