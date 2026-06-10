import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar, Box, Button, Chip, CircularProgress, Divider, IconButton,
  TextField, Typography, Paper
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import SendIcon from '@mui/icons-material/Send';
import { supabase } from '../../supabase';
import { useAuth } from '../../AuthContext';

const STATUS_CONFIG = {
  open: { label: '모집 중', color: '#30B0C7', bg: '#E8F7FA' },
  closing: { label: '마감 임박', color: '#FF9500', bg: '#FFF4E5' },
  closed: { label: '모집 완료', color: '#8e8e93', bg: '#f2f2f7' },
};

const MOCK_POST = {
  id: '1', title: 'UIUX 포트폴리오 스터디 4기 모집', category: 'UIUX',
  tags: ['#UIUX', '#포트폴리오', '#취업준비'], post_type: 'study', study_mode: 'both',
  location: '대구', max_members: 8, current_members: 5, deadline: '2026-06-30',
  duration: '3개월', schedule: '매주 토요일', meeting_time: '오후 2시',
  requirements: '디자인 전공자', goals: '포트폴리오 완성 및 취업 준비',
  status: 'open', likes_count: 24,
  caption: '취업 준비생 대상 포트폴리오 스터디입니다.\n\n매주 1회 온라인 피드백 진행\n월 1회 오프라인 발표\n\n실무 중심 프로젝트 리뷰를 목표로 합니다.',
  image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
  created_at: new Date(Date.now() - 86400000).toISOString(),
  users: { display_name: '디자인멘토', avatar_url: '', bio: 'UX 디자이너 3년차' },
};

const MOCK_COMMENTS = [
  { id: 'c1', content: '비전공자도 참여 가능한가요?', created_at: new Date(Date.now() - 3600000).toISOString(), users: { display_name: '궁금이', avatar_url: '' } },
  { id: 'c2', content: '가능합니다. 기초 툴 사용 경험만 있으면 됩니다!', created_at: new Date(Date.now() - 1800000).toISOString(), users: { display_name: '디자인멘토', avatar_url: '' } },
];

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    setLoading(true);
    try {
      const { data } = await supabase.from('posts').select('*, users(display_name, avatar_url, bio)').eq('id', id).single();
      if (data) {
        setPost(data);
        const { data: cData } = await supabase.from('comments').select('*, users(display_name, avatar_url)').eq('post_id', id).order('created_at');
        if (cData) setComments(cData);
      } else {
        setPost(MOCK_POST);
      }
    } catch {
      setPost(MOCK_POST);
    }
    setLoading(false);
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!user) { navigate('/login'); return; }
    const { data } = await supabase.from('comments').insert({ post_id: id, user_id: user.id, content: newComment }).select('*, users(display_name, avatar_url)').single();
    if (data) setComments([...comments, data]);
    setNewComment('');
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '방금 전';
    if (mins < 60) return `${mins}분 전`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(hours / 24)}일 전`;
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress /></Box>;
  if (!post) return null;

  const status = STATUS_CONFIG[post.status] || STATUS_CONFIG.open;
  const isStudy = post.post_type === 'study';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 12 }}>
      {/* 상단 네비게이션 */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e5e5ea' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 1 }}>
          <IconButton onClick={() => navigate(-1)}><ArrowBackIosNewIcon fontSize="small" /></IconButton>
          <Typography variant="h4" sx={{ flex: 1, textAlign: 'center', fontWeight: 700 }}>
            {isStudy ? '스터디 모집' : '게시물'}
          </Typography>
          <IconButton onClick={() => setBookmarked(!bookmarked)}>
            {bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
          </IconButton>
          <IconButton><ShareIcon /></IconButton>
        </Box>
      </Box>

      {/* 커버 이미지 */}
      {post.image_url && (
        <Box component="img" src={post.image_url} alt={post.title}
          sx={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      <Box sx={{ px: 2, pt: 2 }}>
        {/* 태그 & 상태 */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
          {isStudy && (
            <Chip label={status.label} size="small"
              sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, border: `1px solid ${status.color}` }} />
          )}
          <Chip label={post.category} size="small" sx={{ bgcolor: '#007AFF15', color: '#007AFF', fontWeight: 700 }} />
          {(post.tags || []).map(tag => (
            <Typography key={tag} variant="caption" sx={{ color: 'text.secondary', alignSelf: 'center' }}>{tag}</Typography>
          ))}
        </Box>

        {/* 제목 */}
        <Typography variant="h2" sx={{ mb: 2, lineHeight: 1.4 }}>{post.title}</Typography>

        {/* 작성자 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar src={post.users?.avatar_url || `https://api.dicebear.com/7.x/thumbs/svg?seed=${post.user_id}`} sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{post.users?.display_name || '익명'}</Typography>
            <Typography variant="caption" color="text.secondary">{post.users?.bio || ''} · {timeAgo(post.created_at)}</Typography>
          </Box>
        </Box>

        {/* 스터디 기본 정보 */}
        {isStudy && (
          <Paper elevation={0} sx={{ bgcolor: '#f5f5f7', borderRadius: 3, p: 2, mb: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleAltOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">모집 인원</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{post.current_members || 0} / {post.max_members || 0}명</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">지역</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{post.location || '온라인'}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">마감일</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {post.deadline ? new Date(post.deadline).toLocaleDateString('ko-KR') : '-'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">활동 시간</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{post.meeting_time || '-'}</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}

        {/* 스터디 소개 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>{isStudy ? '스터디 소개' : '내용'}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {post.caption}
          </Typography>
        </Box>

        {/* 모집 정보 테이블 */}
        {isStudy && (post.duration || post.schedule || post.requirements) && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ mb: 1.5 }}>모집 정보</Typography>
            <Paper elevation={0} sx={{ bgcolor: '#f5f5f7', borderRadius: 3, overflow: 'hidden' }}>
              {[
                { label: '진행 기간', value: post.duration },
                { label: '활동 요일', value: post.schedule },
                { label: '활동 시간', value: post.meeting_time },
                { label: '지원 자격', value: post.requirements },
              ].filter(r => r.value).map((row, i) => (
                <Box key={i} sx={{ display: 'flex', px: 2, py: 1.5, borderBottom: i < 3 ? '1px solid #e5e5ea' : 'none' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 100, flexShrink: 0 }}>{row.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.value}</Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* 댓글 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ mb: 1.5 }}>댓글 · 문의 ({comments.length})</Typography>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <Avatar src={comment.users?.avatar_url || `https://api.dicebear.com/7.x/thumbs/svg?seed=${comment.user_id}`} sx={{ width: 32, height: 32 }} />
              <Box sx={{ flex: 1, bgcolor: '#f5f5f7', borderRadius: 2, p: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{comment.users?.display_name || '익명'}</Typography>
                  <Typography variant="caption" color="text.secondary">{timeAgo(comment.created_at)}</Typography>
                </Box>
                <Typography variant="body2">{comment.content}</Typography>
              </Box>
            </Box>
          ))}
          {comments.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>첫 번째 댓글을 남겨보세요!</Typography>
          )}
        </Box>

        {/* 댓글 입력 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth placeholder="댓글 또는 문의를 남겨보세요"
            size="small" value={newComment} onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
          />
          <IconButton color="primary" onClick={handleSubmitComment} disabled={!newComment.trim()}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>

      {/* 하단 고정 액션 */}
      {isStudy && (
        <Paper elevation={0} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid #e5e5ea' }}>
          <Box sx={{ display: 'flex', gap: 1.5, maxWidth: 480, mx: 'auto' }}>
            <Button
              variant="outlined" fullWidth onClick={() => setBookmarked(!bookmarked)}
              startIcon={bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              sx={{ py: 1.5 }}
            >
              {bookmarked ? '저장됨' : '관심 저장'}
            </Button>
            <Button variant="outlined" fullWidth sx={{ py: 1.5 }} onClick={() => navigate('/chat')}>
              문의하기
            </Button>
            <Button
              variant="contained" fullWidth sx={{ py: 1.5 }}
              disabled={post.status === 'closed' || applied}
              onClick={() => setApplied(true)}
            >
              {applied ? '신청 완료' : post.status === 'closed' ? '모집 완료' : '참여 신청'}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default PostDetailPage;
