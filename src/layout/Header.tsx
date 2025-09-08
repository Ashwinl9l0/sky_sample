import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Search, BarChartOutlined } from "@mui/icons-material";
import "./Header.scss";
import logo from "../assets/images/Sky_Master_Brand_Logo_SMALL_RGB.png";
import { alpha, AppBar, Avatar, Box, InputBase, styled } from "@mui/material";
import { useDispatch } from "react-redux";
import { setQuery } from "../redux/slices/searchSlice";
const SearchW = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isActive = (path: string) => location.pathname === path;
  const moveToHome = () => {
    navigate("/");
  };
  useEffect(() => {
    if (location.pathname !== "/") {
      dispatch(setQuery(""));
    }
  }, [location.pathname]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar component="nav">
        <div className="header_container">
          <div className="header_logo">
            <img
              src={logo}
              onClick={moveToHome}
              alt="logo"
              className="header_logoIcon"
            />
          </div>
          <div className="header_search_Container">
            <Link
              to="/analytics"
              className={`analytics_button ${
                isActive("/analytics") ? "active" : "inactive"
              }`}
            >
              <BarChartOutlined />
              <div>Analytics</div>
            </Link>
            {location.pathname === "/" && (
              <SearchW>
                <SearchIconWrapper>
                  <Search />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  onChange={(e) => dispatch(setQuery(e.target.value))}
                />
              </SearchW>
            )}
            <div className="header-avatar">
              <Avatar src="/broken-image.jpg" sizes="small" />
            </div>
          </div>
        </div>
      </AppBar>
    </Box>
  );
};

export default AppHeader;
