import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, IconButton, Paper, TextField, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ROOMS = {
  r1: { name: 'UIUX 포트폴리오 스터디 4기', room_type: 'group', member_count: 5 },
  r2: { name: '디자인멘토', room_type: 'direct', member_count: 2 },
  r3: { name: '브랜드 아이덴티티 스터디', room_type: 'group', member_count: 4 },
  r4: { name: '마케터박', room_type: 'direct', member_count: 2 },
};

const MOCK_MESSAGES = [
  { id: 'm1', content: '안녕하세요! 스터디에 관심이 있어서요 😊', created_at: new Date(Date.now() - 3600000 * 2).toISOString(), is_mine: false, sender: '디자인멘토', avatar: '' },
  { id: 'm2', content: '안녕하세요! 반갑습니다. 어떤 부분이 궁금하신가요?', created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(), is_mine: true, sender: '나', avatar: '' },
  { id: 'm3', content: '포트폴리오가 아직 많이 부족한데 참여해도 될까요?', created_at: new Date(Date.now() - 3600000).toISOString(), is_mine: false, sender: '디자인멘토', avatar: '' },
  { id: 'm4', content: '물론이죠! 함께 만들어 나가는 스터디니까요 ✨\n초보자도 환영입니다!', created_at: new Date(Date.now() - 1800000).toISOString(), is_mine: true, sender: '나', avatar: '' },
  { id: 'm5', content: '감사합니다! 다음 주 모임에서 뵐게요 😊', created_at: new Date(Date.now() - 600000).toISOString(), is_mine: false, sender: '디자인멘토', avatar: '' },
];

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
};

function ChatRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const room = ROOMS[roomId] || { name: '채팅방', room_type: 'direct', member_count: 2 };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: `m${Date.now()}`,
      content: input,
      created_at: new Date().toISOString(),
      is_mine: true,
      sender: '나',
      avatar: '',
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#f5f5f7' }}>
      {/* 헤더 */}
      <Paper elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e5e5ea', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 1 }}>
          <IconButton onClick={() => navigate('/chat')}><ArrowBackIosNewIcon fontSize="small" /></IconButton>
          <Box sx={{ flex: 1, ml: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{room.name}</Typography>
            {room.room_type === 'group' && (
              <Typography variant="caption" color="text.secondary">멤버 {room.member_count}명</Typography>
            )}
          </Box>
          <IconButton><MoreVertIcon /></IconButton>
        </Box>
      </Paper>

      {/* 메시지 목록 */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5 }}>
        {messages.map((msg, i) => {
          const showDate = i === 0 || new Date(messages[i - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString();
          return (
            <Box key={msg.id}>
              {showDate && (
                <Box sx={{ textAlign: 'center', my: 2 }}>
                  <Typography variant="caption" sx={{ bgcolor: 'rgba(0,0,0,0.12)', color: 'white', px: 2, py: 0.5, borderRadius: 10, fontSize: '0.7rem' }}>
                    {new Date(msg.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: msg.is_mine ? 'flex-end' : 'flex-start', mb: 1, alignItems: 'flex-end', gap: 1 }}>
                {!msg.is_mine && (
                  <Avatar src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${msg.sender}`} sx={{ width: 32, height: 32, alignSelf: 'flex-start' }} />
                )}
                <Box sx={{ maxWidth: '70%' }}>
                  {!msg.is_mine && room.room_type === 'group' && (
                    <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>{msg.sender}</Typography>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, flexDirection: msg.is_mine ? 'row-reverse' : 'row' }}>
                    <Box
                      sx={{
                        px: 2, py: 1.25, borderRadius: msg.is_mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        bgcolor: msg.is_mine ? 'primary.main' : 'white',
                        color: msg.is_mine ? 'white' : 'text.primary',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        wordBreak: 'break-word',
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>{msg.content}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', flexShrink: 0 }}>
                      {formatTime(msg.created_at)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
        <div ref={bottomRef} />
      </Box>

      {/* 입력창 */}
      <Paper elevation={0} sx={{ px: 2, py: 1.5, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid #e5e5ea', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth placeholder="메시지 입력" size="small"
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            multiline maxRows={4}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f5f5f7' } }}
          />
          <IconButton
            onClick={handleSend} disabled={!input.trim()}
            sx={{ bgcolor: input.trim() ? 'primary.main' : '#e5e5ea', color: input.trim() ? 'white' : 'text.secondary', '&:hover': { bgcolor: input.trim() ? 'primary.dark' : '#e5e5ea' }, '&:disabled': { bgcolor: '#e5e5ea' }, flexShrink: 0 }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}

export default ChatRoomPage;
