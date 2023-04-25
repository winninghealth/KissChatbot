import React, { useContext, useState } from "react";
import { Box, Stack, styled, Typography, useMediaQuery } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { chatContext } from "../../context/ChatContext";
import botIcon from "../../assets/favicon.ico";
import examples from "./index.json";
import SingleExample from "./SingleExample";

import TagSharpIcon from "@mui/icons-material/TagSharp";

const Home = () => {
  const { setInputValue } = useContext(chatContext);

  const [open, setOpen] = React.useState(false);
  const handleOpen = (item) => {
    setOpen(true);
    setModelData(item);
  };

  const [modelData, setModelData] = useState(null);

  const [showAll, setShowAll] = useState(false);

  const handleShowAll = () => {
    setShowAll(true);
  };

  const isColumn = useMediaQuery("(max-width:970px)");

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      justify-content="center"
      rowGap="5px"
      margin="60px 8% 90px"
    >
      {/* Model */}
      {open && <SingleExample {...modelData} open={open} setOpen={setOpen} />}

      {/* Logo */}
      <Box
        // border={1}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h1 style={{ fontSize: "50px", margin: 0 }}>KissChatbot</h1>
      </Box>

      {/* example,limitations */}
      <Stack
        // border={1}
        width="100%"
        direction={{ sm: "column", md: "row" }}
        justifyContent="center"
        alignItems="flex-start"
        spacing={{ xs: 4, md: 2 }}
      >
        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          flex={1}
          width="100%"
        >
          <LightModeOutlinedIcon />
          <Typography>Examples</Typography>
          {[
            "Explaining what metaverse is in simple terms.",
            "Write a poem about the warm spring breeze and the reawakening of all things.",
            "Recursive algorithm in C language.",
          ].map((item, idx) => (
            <Item
              hover="true"
              key={idx}
              onClick={() => {
                setInputValue(item);
              }}
            >
              {item}
            </Item>
          ))}
        </Stack>
        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          flex={1}
          width="100%"
        >
          <ElectricBoltOutlinedIcon />
          <Typography>Capabilities</Typography>
          {[
          "Remembers what user said earlier in the conversation",
          "Allows user to provide follow-up corrections",
          "Trained to decline inappropriate requests",
          ].map((item, idx) => (
            <Item key={idx}>{item}</Item>
          ))}
        </Stack>
        <Stack
          display="flex"
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          flex={1}
          width="100%"
        >
          <WarningAmberRoundedIcon />
          <Typography>Limitations</Typography>
          {[
             "May occasionally generate incorrect information",
             "May occasionally produce harmful instructions or biased content",
             "Limited knowledge of world and events after 2021"
          ].map((item, idx) => (
            <Item key={idx}>{item}</Item>
          ))}
        </Stack>
      </Stack>

    </Box>
  );
};

export default Home;

const Item = styled(Box)(({ theme, hover }) => ({
  borderRadius: "6px",
  textAlign: "center",
  fontSize: "14px",
  padding: "10px 15px",
  width: "100%",
  whiteSpace: "pre-wrap",
  backgroundColor: theme.palette.background.accent,

  "&:hover": {
    cursor: `${hover === "true" && "pointer"}`,
    backgroundColor: `${hover === "true" && theme.palette.background.dark}`,
  },
}));

const ShowMorewExamples = styled("div")(
  ({ theme, showAll, collapseHeight, isColumn }) => ({
    width: "100%",
    display: "grid",
    gridTemplateColumns: `${isColumn ? "1fr" : "repeat(2, 1fr)"}`,
    gap: "30px",
    overflow: "hidden",
    position: "relative",
    maxHeight: `${showAll ? "100%" : collapseHeight}`,
    "&::before": {
      content: '""',
      width: "100%",
      height: `${showAll ? 0 : "200px"}`,
      position: "absolute",
      bottom: 0,
      background: `${
        !showAll &&
        `linear-gradient(180deg, rgba(0,0,0,0), 40%,${theme.palette.background.primary})`
      }`,
      transition: "0.3s",
    },

    ".showall__button": {
      cursor: "pointer",
      background: theme.palette.background.dark,
      color: theme.palette.text.primary,
      borderRadius: "5px",
      position: "absolute",
      bottom: "50px",
      left: "50%",
      display: "flex",
      alignItems: "center",
      padding: "10px 13px",
      fontWeight: "bold",
      transform: "translateX(-50%)",
    },
  })
);
