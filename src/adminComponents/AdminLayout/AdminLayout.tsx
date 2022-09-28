import React from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { People } from "@mui/icons-material";

function AdminLayout() {
  const navigate = useNavigate();
  const logOutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/sign-in");
  };

  const drawerWidth = 240;
  const drawer = (
    <div id="menu">
      <Toolbar>
        <IconButton />
      </Toolbar>
      <Divider />
      <List>
        {[{ title: "Users", icon: <People />, link: "user" }].map(
          (text, index) => (
            <NavLink className="no-underline" key={index} to={text.link}>
              <ListItem key={text.title} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{text.icon}</ListItemIcon>
                  <ListItemText primary={text.title} />
                </ListItemButton>
              </ListItem>
            </NavLink>
          )
        )}
      </List>
    </div>
  );

  return (
    <Box className="flex">
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit" onClick={logOutUser}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },

          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        {/* <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          // onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer> */}
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
        sx={{
          flexGrow: 1,
          p: { xs: 3 },
          mt: { xs: 7 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;
