import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '../api/AuthContext';
const pages = ['home', 'about', 'classroom'];
const adminPages = ['admin', 'management'];
const managements = ['account', 'class'];

function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElManagement, setAnchorElManagement] = React.useState(null);
    const navigate = useNavigate();
    const { isLoggedIn, isAdmin, user, logout } = useAuthContext();
    console.log(isAdmin);
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleLogout = () => {
        setAnchorElUser(null);
        // Thực hiện đăng xuất khi người dùng click vào nút Logout
        logout();
        navigate('/home');
    };
  function handleCloseManagementMenu() {
    setAnchorElManagement(null);
  }
  function handleOpenManagementMenu(event) {
    setAnchorElManagement(event.currentTarget);
  }
  function renderTabsOnHeader(tabNames) {
      return tabNames.map((page) => (
        page === 'management' ? (
            <>
              <Button
                key={page}
                onClick={handleOpenManagementMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElManagement}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElManagement)}
                onClose={handleCloseManagementMenu}
              >
                {managements.map((type) => (
                  <Link style={{ textDecoration: 'none', color: 'black' }} to={`/management/${type}`} >
                    <MenuItem key={type} onClick={handleCloseManagementMenu}>
                      <Typography textAlign="center" >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Typography>
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
            </>
          )
          : (<Button
            key={page}
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            <Link style={{ textDecoration: 'none', color: 'white' }} to={`/${page}`} >{page}</Link>
          </Button>)
      ));
  }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        <Link style={{ textDecoration: 'none', color: 'black' }} to={`/${page}`} >{page}</Link>

                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                      {isAdmin ? renderTabsOnHeader(adminPages) : renderTabsOnHeader(pages)}
                    </Box>

                    <Box sx={{ flexGrow: 0 }} >
                        {isLoggedIn ? (
                            <>
                                <Tooltip title="Open settings">

                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Typography color={'white'} px={2}> {user.fullName} </Typography>
                                        <Avatar alt={user.fullName} src={user.avatar} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <Link style={{ textDecoration: 'none', color: 'black' }} to='/user/profile' >
                                        <MenuItem key='profile' onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center" >
                                                Profile
                                            </Typography>
                                        </MenuItem>
                                    </Link>
                                    <Link style={{ textDecoration: 'none', color: 'black' }} to='/user/edit' >
                                        <MenuItem key='edit' onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center" >
                                                Edit
                                            </Typography>
                                        </MenuItem>
                                    </Link>
                                    <Link style={{ textDecoration: 'none', color: 'black' }} to='/user/change-password' >
                                        <MenuItem key='change-password' onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center" >
                                                Change Password
                                            </Typography>
                                        </MenuItem>
                                    </Link>
                                    <MenuItem key='logout' onClick={handleLogout}>
                                        <Typography textAlign="center" >
                                            Logout
                                        </Typography>
                                    </MenuItem>

                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button variant='outlined' color='inherit' sx={{ mx: 2 }} >
                                    <Link to={'/signin'} style={{ textDecoration: 'none', color: 'white' }} >Sign In</Link>
                                </Button>
                                <Button variant='outlined' color='inherit' sx={{ mx: 2 }} >
                                    <Link to={'/signup'} style={{ textDecoration: 'none', color: 'white' }} >Sign Up</Link>
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Header;
