import { AppBar, Box, IconButton, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TopBar({ title }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: '내 일정', icon: <CalendarMonthOutlinedIcon />, path: '/calendar' },
    { label: '저장한 스터디', icon: <BookmarkBorderOutlinedIcon />, path: '/bookmarks' },
    { label: '알림', icon: <NotificationsOutlinedIcon />, path: '/notifications' },
    { label: '고객센터', icon: <ContactSupportOutlinedIcon />, path: '/help' },
    { label: '설정', icon: <SettingsOutlinedIcon />, path: '/settings' },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #e5e5ea',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ minHeight: 56, px: 2 }}>
          <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ color: 'primary.main' }}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            {title ? (
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {title}
              </Typography>
            ) : (
              <Typography
                variant="h3"
                sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.5px', cursor: 'pointer' }}
                onClick={() => navigate('/')}
              >
                MATE
              </Typography>
            )}
          </Box>

          <IconButton sx={{ color: 'text.secondary' }}>
            <NotificationsOutlinedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, pt: 2 }}>
          <Box sx={{ px: 3, pb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
              MATE
            </Typography>
            <Typography variant="body2" color="text.secondary">
              디자인&마케팅 스터디 플랫폼
            </Typography>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.label}
                onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
              >
                <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default TopBar;
