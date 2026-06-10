import { BottomNavigation, BottomNavigationAction, Box, Fab, Paper } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation, useNavigate } from 'react-router-dom';

function BottomBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const getValue = () => {
    if (path === '/') return 0;
    if (path.startsWith('/explore')) return 1;
    if (path.startsWith('/chat')) return 3;
    if (path.startsWith('/mypage')) return 4;
    return false;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        /* 컨테이너(max-width 480px)와 동일하게 중앙 정렬 */
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 1100,
        bgcolor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid #e5e5ea',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <BottomNavigation value={getValue()} showLabels sx={{ bgcolor: 'transparent', height: 64 }}>
          <BottomNavigationAction
            label="홈"
            icon={getValue() === 0 ? <HomeIcon /> : <HomeOutlinedIcon />}
            onClick={() => navigate('/')}
            sx={{ '&.Mui-selected': { color: 'primary.main' } }}
          />
          <BottomNavigationAction
            label="탐색"
            icon={getValue() === 1 ? <SearchIcon /> : <SearchOutlinedIcon />}
            onClick={() => navigate('/explore')}
            sx={{ '&.Mui-selected': { color: 'primary.main' } }}
          />
          <BottomNavigationAction
            label=""
            icon={<Box sx={{ width: 56 }} />}
            disabled
          />
          <BottomNavigationAction
            label="채팅"
            icon={getValue() === 3 ? <ChatBubbleIcon /> : <ChatBubbleOutlineOutlinedIcon />}
            onClick={() => navigate('/chat')}
            sx={{ '&.Mui-selected': { color: 'primary.main' } }}
          />
          <BottomNavigationAction
            label="내 정보"
            icon={getValue() === 4 ? <PersonIcon /> : <PersonOutlinedIcon />}
            onClick={() => navigate('/mypage')}
            sx={{ '&.Mui-selected': { color: 'primary.main' } }}
          />
        </BottomNavigation>

        <Fab
          color="primary"
          size="medium"
          onClick={() => navigate('/write')}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 52,
            height: 52,
            boxShadow: '0 4px 14px rgba(0,122,255,0.4)',
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Paper>
  );
}

export default BottomBar;
