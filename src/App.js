import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import { SnackbarProvider } from "notistack";

import { CategoryProvider } from "./_contexts/CategoryContext";
import AuthContext from "./_contexts/AuthContext";
import { ImageGroupProvider } from "./_contexts/ImageGroupContext";
import ImageGroupListPage from "./_components/ImageGroupListPage";
import ImageGroupPage from "./_components/ImageGroupPage";
import EditorPage from "./_components/EditorPage";

import Link from "@material-ui/core/Link";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },

  appBar: {
    background: theme.palette.background.paper,
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
  },

  menuButton: {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.contrastText
  },

  appTitle: {
    color: theme.palette.primary.contrastText,
    marginRight: "auto",
    cursor: "pointer"
  },

  avatarName: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(1)
  },

  logoutButton: {
    color: theme.palette.primary.contrastText
  },

  content: {
    minHeight: "calc(100vh - 64px)",
    background: theme.palette.primary,
    marginTop: "64px",
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

function App() {
  const {
    payload: [payload],
    token: [, setToken]
  } = useContext(AuthContext);
  const classes = useStyles();

  const handleLogoutClick = () => {
    setToken("null");
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton}>
              <MenuIcon />
            </IconButton>

            <Link underline="none" href="/app" className={classes.appTitle}>
              <Typography variant="h6">Labler</Typography>
            </Link>

            <Button
              size="small"
              className={classes.logoutButton}
              onClick={handleLogoutClick}
            >
              Logout
            </Button>

            <Typography variant="overline" className={classes.avatarName}>
              {payload?.username}
            </Typography>
            <IconButton className={classes.avatarButton}>
              <Avatar>{payload?.username?.charAt(0).toUpperCase()}</Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        <main className={classes.content}>
          <Router>
            <Switch>
              <ImageGroupProvider>
                <CategoryProvider>
                  <Route
                    exact
                    path="/app/imageGroups/:groupId"
                    component={ImageGroupPage}
                  />
                  <Route exact path="/app" component={ImageGroupListPage} />
                  <Route
                    exact
                    path="/app/imageGroups/:imageGroupId/images/:imageId"
                    component={EditorPage}
                  />
                </CategoryProvider>
              </ImageGroupProvider>
            </Switch>
          </Router>
        </main>
      </div>
    </SnackbarProvider>
  );
}

export default App;
