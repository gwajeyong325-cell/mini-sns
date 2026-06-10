import { useState } from 'react';
import {
  Avatar, Box, Button, Card, CardContent, Chip, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, IconButton, List, ListItem,
  ListItemIcon, ListItemText, Tab, Tabs, TextField, Typography
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RefreshIcon from '@mui/icons-material/Refresh';
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const MOCK_MY_STUDIES = [
  { id: '1', title: 'UIUX 포트폴리오 스터디 4기', category: 'UIUX', status: 'open', role: 'member', current_members: 5, max_members: 8 },
  { id: '3', title: '영상편집 & 모션그래픽 입문 스터디', category: '영상편집', status: 'open', role: 'leader', current_members: 7, max_members: 10 },
];

const MOCK_BOOKMARKS = [
  { id: '2', title: '브랜드 아이덴티티 디자인 스터디', category: '브랜딩', status: 'closing', current_members: 5, max_members: 6 },
];

const INTERESTS = ['UI/UX', '브랜딩', '그래픽', '영상편집', '마케팅', '포트폴리오', '취업준비', '공모전'];

const AVATAR_SEEDS = ['Felix', 'Aneka', 'Lily', 'Sophie', 'Max', 'Luna', 'Oliver', 'Mia'];

const STATUS_CONFIG = {
  open: { label: '모집 중', color: '#30B0C7' },
  closing: { label: '마감 임박', color: '#FF9500' },
  closed: { label: '모집 완료', color: '#8e8e93' },
};

function MyPage() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '사용자');
  const [bio, setBio] = useState(profile?.bio || '');
  const [interests, setInterests] = useState(profile?.interests || []);
  const [avatarSeed, setAvatarSeed] = useState(profile?.display_name || 'User');

  const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${avatarSeed}`;

  const handleSave = async () => {
    await updateProfile({ display_name: displayName, bio, interests, avatar_url: avatarUrl });
    setEditOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const refreshAvatar = () => {
    const seed = AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)] + Math.random().toString(36).slice(2, 5);
    setAvatarSeed(seed);
  };

  const toggleInterest = (item) => {
    setInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      <TopBar title="마이페이지" />

      {/* 프로필 헤더 */}
      <Box sx={{ bgcolor: 'white', px: 3, pt: 3, pb: 2, borderBottom: '1px solid #e5e5ea' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar src={profile?.avatar_url || avatarUrl} sx={{ width: 72, height: 72 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {profile?.display_name || user?.email?.split('@')[0] || '사용자'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{profile?.username || user?.email?.split('@')[0] || 'username'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {profile?.bio || '자기소개를 작성해 보세요'}
            </Typography>
          </Box>
          <IconButton onClick={() => setEditOpen(true)} sx={{ bgcolor: '#f5f5f7' }}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* 관심 분야 */}
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {(profile?.interests || ['UI/UX', '마케팅']).map(interest => (
            <Chip key={interest} label={interest} size="small"
              sx={{ bgcolor: '#007AFF15', color: 'primary.main', fontWeight: 600, fontSize: '0.7rem' }} />
          ))}
        </Box>

        {/* 통계 */}
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          {[
            { label: '참여 스터디', value: MOCK_MY_STUDIES.filter(s => s.role === 'member').length },
            { label: '개설 스터디', value: MOCK_MY_STUDIES.filter(s => s.role === 'leader').length },
            { label: '북마크', value: MOCK_BOOKMARKS.length },
          ].map(stat => (
            <Box key={stat.label} sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: 'primary.main' }}>{stat.value}</Typography>
              <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 탭 */}
      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}
        sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e5ea', '& .Mui-selected': { color: 'primary.main' } }}>
        <Tab label="내 스터디" sx={{ fontWeight: 600 }} />
        <Tab label="북마크" sx={{ fontWeight: 600 }} />
        <Tab label="설정" sx={{ fontWeight: 600 }} />
      </Tabs>

      <Box sx={{ px: 2, pt: 2 }}>
        {/* 내 스터디 탭 */}
        {tabValue === 0 && (
          <>
            {MOCK_MY_STUDIES.map((study) => (
              <Card key={study.id} sx={{ mb: 1.5, cursor: 'pointer' }} onClick={() => navigate(`/post/${study.id}`)}>
                <CardContent sx={{ p: 2, pb: '12px !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip label={study.role === 'leader' ? '개설자' : '참여 중'} size="small"
                      sx={{ bgcolor: study.role === 'leader' ? '#007AFF15' : '#34C75915', color: study.role === 'leader' ? 'primary.main' : 'success.main', fontWeight: 700 }} />
                    <Chip label={STATUS_CONFIG[study.status].label} size="small"
                      sx={{ color: STATUS_CONFIG[study.status].color, fontWeight: 600 }} />
                  </Box>
                  <Typography variant="h4" sx={{ mb: 0.5 }}>{study.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {study.category} · {study.current_members}/{study.max_members}명
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {MOCK_MY_STUDIES.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="text.secondary">참여 중인 스터디가 없어요</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>스터디 찾기</Button>
              </Box>
            )}
          </>
        )}

        {/* 북마크 탭 */}
        {tabValue === 1 && (
          <>
            {MOCK_BOOKMARKS.map((study) => (
              <Card key={study.id} sx={{ mb: 1.5, cursor: 'pointer' }} onClick={() => navigate(`/post/${study.id}`)}>
                <CardContent sx={{ p: 2, pb: '12px !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip label={study.category} size="small" sx={{ bgcolor: '#007AFF15', color: 'primary.main', fontWeight: 700 }} />
                    <Chip label={STATUS_CONFIG[study.status].label} size="small" sx={{ color: STATUS_CONFIG[study.status].color }} />
                  </Box>
                  <Typography variant="h4">{study.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{study.current_members}/{study.max_members}명</Typography>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {/* 설정 탭 */}
        {tabValue === 2 && (
          <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e5e5ea', overflow: 'hidden' }}>
            <List disablePadding>
              {[
                { icon: <BookmarkBorderOutlinedIcon />, label: '저장한 스터디', action: () => setTabValue(1) },
                { icon: <NotificationsNoneOutlinedIcon />, label: '알림 설정', action: () => {} },
              ].map((item, i) => (
                <Box key={item.label}>
                  <ListItem onClick={item.action} sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f7' } }}>
                    <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                    <ChevronRightIcon sx={{ color: 'text.secondary' }} />
                  </ListItem>
                  {i < 1 && <Divider component="li" />}
                </Box>
              ))}
              <Divider />
              <ListItem onClick={handleLogout} sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f7' } }}>
                <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}><LogoutOutlinedIcon /></ListItemIcon>
                <ListItemText primary="로그아웃" sx={{ color: 'error.main' }} />
              </ListItem>
              <Divider />
              <ListItem sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f7' } }}>
                <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}><DeleteOutlineOutlinedIcon /></ListItemIcon>
                <ListItemText primary="회원 탈퇴" sx={{ color: 'error.main' }} />
              </ListItem>
            </List>
          </Box>
        )}
      </Box>

      {/* 프로필 편집 다이얼로그 */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>프로필 편집</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${avatarSeed}`} sx={{ width: 80, height: 80, mb: 1 }} />
            <Button startIcon={<RefreshIcon />} size="small" onClick={refreshAvatar} sx={{ color: 'primary.main' }}>
              랜덤 변경
            </Button>
          </Box>
          <TextField fullWidth label="닉네임" value={displayName} onChange={(e) => setDisplayName(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="소개글" multiline rows={3} value={bio} onChange={(e) => setBio(e.target.value)} sx={{ mb: 2 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>관심 분야</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {INTERESTS.map(item => (
              <Chip key={item} label={item} onClick={() => toggleInterest(item)}
                sx={{ fontWeight: 600, bgcolor: interests.includes(item) ? 'primary.main' : 'white', color: interests.includes(item) ? 'white' : 'text.secondary', border: '1px solid #e5e5ea' }} />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)} variant="outlined" sx={{ flex: 1 }}>취소</Button>
          <Button onClick={handleSave} variant="contained" sx={{ flex: 1 }}>저장</Button>
        </DialogActions>
      </Dialog>

      <BottomBar />
    </Box>
  );
}

export default MyPage;
