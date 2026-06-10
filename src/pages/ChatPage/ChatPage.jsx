import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, Box, Chip, Divider, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';

const MOCK_ROOMS = [
  { id: 'r1', name: 'UIUX 포트폴리오 스터디 4기', room_type: 'group', member_count: 5, last_message: '다음 주 모임 시간 괜찮으신가요?', last_message_at: new Date(Date.now() - 600000).toISOString(), unread: 3, avatar: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100' },
  { id: 'r2', name: '디자인멘토', room_type: 'direct', member_count: 2, last_message: '포트폴리오 피드백 감사합니다!', last_message_at: new Date(Date.now() - 3600000).toISOString(), unread: 0, avatar: '' },
  { id: 'r3', name: '브랜드 아이덴티티 스터디', room_type: 'group', member_count: 4, last_message: '다음 미션 공유드립니다 📌', last_message_at: new Date(Date.now() - 7200000).toISOString(), unread: 1, avatar: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=100' },
  { id: 'r4', name: '마케터박', room_type: 'direct', member_count: 2, last_message: '안녕하세요! 스터디 참여 관련 문의드립니다.', last_message_at: new Date(Date.now() - 86400000).toISOString(), unread: 0, avatar: '' },
];

const FILTERS = [
  { label: '전체', value: 'all' },
  { label: '그룹', value: 'group' },
  { label: '1:1', value: 'direct' },
];

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금';
  if (mins < 60) return `${mins}분`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간`;
  return `${Math.floor(hours / 24)}일`;
};

function ChatPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredRooms = MOCK_ROOMS.filter((room) => {
    const matchFilter = filter === 'all' || room.room_type === filter;
    const matchSearch = !search || room.name.includes(search) || room.last_message.includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      <TopBar title="MATECHAT" />

      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <TextField
          fullWidth placeholder="채팅방 검색" size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> } }}
          sx={{ bgcolor: 'white', borderRadius: 3 }}
        />
      </Box>

      <Box sx={{ px: 2, py: 1, display: 'flex', gap: 1 }}>
        {FILTERS.map((f) => (
          <Chip
            key={f.value}
            label={f.label}
            size="small"
            onClick={() => setFilter(f.value)}
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
              bgcolor: filter === f.value ? 'primary.main' : 'white',
              color: filter === f.value ? 'white' : 'text.secondary',
              border: `1px solid ${filter === f.value ? '#007AFF' : '#e5e5ea'}`,
              '&:hover': {
                bgcolor: filter === f.value ? 'primary.dark' : '#f5f5f7',
              },
            }}
          />
        ))}
      </Box>

      <Box sx={{ bgcolor: 'white', mx: 2, borderRadius: 3, border: '1px solid #e5e5ea', overflow: 'hidden' }}>
        {filteredRooms.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body2" color="text.secondary">채팅방이 없어요</Typography>
          </Box>
        ) : (
          filteredRooms.map((room, index) => (
            <Box key={room.id}>
              <Box
                onClick={() => navigate(`/chat/${room.id}`)}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f7' } }}
              >
                <Badge badgeContent={room.unread} color="primary" overlap="circular"
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16 } }}>
                  <Avatar
                    src={room.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${room.id}`}
                    sx={{ width: 48, height: 48, bgcolor: 'primary.light' }}
                  />
                </Badge>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{room.name}</Typography>
                      {room.room_type === 'group' && (
                        <Typography variant="caption" color="text.secondary">({room.member_count})</Typography>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">{timeAgo(room.last_message_at)}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {room.last_message}
                  </Typography>
                </Box>
              </Box>
              {index < filteredRooms.length - 1 && <Divider sx={{ mx: 2 }} />}
            </Box>
          ))
        )}
      </Box>

      <BottomBar />
    </Box>
  );
}

export default ChatPage;
