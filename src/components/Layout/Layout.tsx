import React, { useState, createContext } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Outlet, useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import { Avatar, IconButton } from "@mui/material";

type AppContextInterface = {
  sendMessageVisible: boolean;
  setSendMessageVisible: (value: boolean) => void;
};

export const ContextApi = createContext<AppContextInterface | null>(null);

function Layout() {
  const [sendMessageVisible, setSendMessageVisible] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const handleMenuClose = () => {
    navigate("/sign-in");
    setIsMenuOpen(false);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
  };

  const handleOpenUserMenu = () => {
    setIsMenuOpen(true);
  };

  const contextValue: AppContextInterface = {
    sendMessageVisible,
    setSendMessageVisible,
  };
  const drawerWidth = 240;

  return (
    <ContextApi.Provider value={contextValue}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar className="flex justify-end gap-x-2">
            <Typography variant="h6">
              {JSON.parse(localStorage.getItem("user") || "{}").user_name}
            </Typography>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="" src="/static/images/avatar/2.jpg" />
            </IconButton>

            <Menu
              sx={{ mt: "45px" }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={isMenuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {["send a message"].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setSendMessageVisible(true);
                    }}
                  >
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ContextApi.Provider>
  );
}

export default Layout;
