import { useState } from 'react';
import {
  Avatar, Box, Button, Chip, CircularProgress, Divider, IconButton,
  MenuItem, Select, Step, StepLabel, Stepper, TextField, Typography, Paper, Alert
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useAuth } from '../../AuthContext';
import { addLocalPost } from '../../postsStore';

const CATEGORIES = ['UIUX', '브랜딩', '그래픽', '영상편집', '마케팅', '기타'];
const REGIONS = ['온라인', '서울', '경기', '인천', '부산', '대구', '광주', '대전', '기타'];

const PICSUM_IMAGES = [
  'https://picsum.photos/seed/design1/600/400',
  'https://picsum.photos/seed/study2/600/400',
  'https://picsum.photos/seed/workspace3/600/400',
  'https://picsum.photos/seed/creative4/600/400',
  'https://picsum.photos/seed/team5/600/400',
  'https://picsum.photos/seed/portfolio6/600/400',
  'https://picsum.photos/seed/office7/600/400',
  'https://picsum.photos/seed/meeting8/600/400',
];

function WritePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [postType, setPostType] = useState('feed');
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [randomImages, setRandomImages] = useState(PICSUM_IMAGES.slice(0, 6));
  const [selectedImage, setSelectedImage] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);

  const [form, setForm] = useState({
    title: '', caption: '', category: 'UIUX', tags: '',
    study_mode: 'online', location: '온라인',
    max_members: 8, deadline: '', duration: '',
    schedule: '', meeting_time: '', requirements: '', goals: '',
  });

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const refreshImages = () => {
    setImageLoading(true);
    const shuffled = [...PICSUM_IMAGES].sort(() => Math.random() - 0.5).slice(0, 6);
    setTimeout(() => { setRandomImages(shuffled); setImageLoading(false); }, 400);
  };

  const handleSubmitFeed = async () => {
    if (!user) { navigate('/login'); return; }
    if (!form.caption.trim()) { setError('내용을 입력해 주세요.'); return; }
    setLoading(true);
    setError('');

    const tags = form.tags.split(' ').filter(t => t.trim()).map(t => t.startsWith('#') ? t : `#${t}`);
    const newPost = {
      id: 'local-' + Date.now(),
      user_id: user.id,
      title: form.caption.slice(0, 50),
      caption: form.caption,
      category: form.category,
      tags,
      post_type: 'feed',
      image_url: selectedImage || '',
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      users: {
        display_name: profile?.display_name || user.email?.split('@')[0] || '나',
        avatar_url: profile?.avatar_url || '',
      },
      _local: true,
    };

    // 실제 Supabase 유저면 DB에도 저장 시도
    if (!user.demo) {
      await supabase.from('posts').insert({
        user_id: user.id, title: newPost.title, caption: form.caption,
        category: form.category, tags, post_type: 'feed', image_url: selectedImage || '',
      }).select().single();
    }

    addLocalPost(newPost);
    setLoading(false);
    navigate('/');
  };

  const handleSubmitStudy = async () => {
    if (!user) { navigate('/login'); return; }
    if (!form.title.trim() || !form.caption.trim()) { setError('제목과 내용을 입력해 주세요.'); return; }
    setLoading(true);
    setError('');

    const tags = form.tags.split(' ').filter(t => t.trim()).map(t => t.startsWith('#') ? t : `#${t}`);
    const newPost = {
      id: 'local-' + Date.now(),
      user_id: user.id,
      title: form.title,
      caption: form.caption,
      category: form.category,
      tags,
      post_type: 'study',
      image_url: selectedImage || `https://picsum.photos/seed/${form.category}-${Date.now()}/400/200`,
      study_mode: form.study_mode,
      location: form.location,
      max_members: Number(form.max_members),
      current_members: 0,
      deadline: form.deadline || null,
      duration: form.duration,
      schedule: form.schedule,
      meeting_time: form.meeting_time,
      requirements: form.requirements,
      status: 'open',
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      users: {
        display_name: profile?.display_name || user.email?.split('@')[0] || '나',
        avatar_url: profile?.avatar_url || '',
      },
      _local: true,
    };

    if (!user.demo) {
      await supabase.from('posts').insert({ ...newPost, id: undefined, users: undefined, _local: undefined }).select().single();
    }

    addLocalPost(newPost);
    setLoading(false);
    navigate('/');
  };

  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.id}`;
  const displayName = profile?.display_name || user?.email?.split('@')[0] || '나';

  // ─── 피드 포스트: 트위터 스타일 단일 화면 ───
  if (postType === 'feed') {
    return (
      <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: '1px solid #e5e5ea', position: 'sticky', top: 0, zIndex: 100, bgcolor: 'white' }}>
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              label="피드"
              size="small"
              onClick={() => setPostType('feed')}
              sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}
            />
            <Chip
              label="스터디 모집"
              size="small"
              variant="outlined"
              onClick={() => setPostType('study')}
              sx={{ fontWeight: 700 }}
            />
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmitFeed}
            disabled={loading || !form.caption.trim()}
            sx={{ borderRadius: 20, px: 2.5, py: 0.75, fontWeight: 700, minWidth: 64 }}
          >
            {loading ? <CircularProgress size={16} color="inherit" /> : '게시'}
          </Button>
        </Box>

        {/* 작성 영역 */}
        <Box sx={{ display: 'flex', gap: 1.5, px: 2, pt: 2 }}>
          <Avatar src={avatarUrl} sx={{ width: 40, height: 40, flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>{displayName}</Typography>
            <TextField
              fullWidth multiline minRows={4} placeholder="무슨 일이 있었나요?"
              value={form.caption} onChange={(e) => updateForm('caption', e.target.value)}
              variant="standard"
              slotProps={{ input: { disableUnderline: true, style: { fontSize: '1rem', lineHeight: 1.6 } } }}
            />

            {/* 선택된 이미지 미리보기 */}
            {selectedImage && (
              <Box sx={{ position: 'relative', mt: 1.5, borderRadius: 3, overflow: 'hidden', border: '1px solid #e5e5ea' }}>
                <Box component="img" src={selectedImage} sx={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }} />
                <IconButton
                  size="small"
                  onClick={() => setSelectedImage('')}
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            {/* 이미지 피커 */}
            {showImagePicker && (
              <Box sx={{ mt: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>이미지 선택</Typography>
                  <IconButton size="small" onClick={refreshImages}><RefreshIcon fontSize="small" /></IconButton>
                </Box>
                {imageLoading ? <CircularProgress size={20} /> : (
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                    {randomImages.map((url, i) => (
                      <Box key={i} onClick={() => { setSelectedImage(url); setShowImagePicker(false); }}
                        sx={{ borderRadius: 2, overflow: 'hidden', cursor: 'pointer', aspectRatio: '1', border: `2px solid ${selectedImage === url ? '#007AFF' : 'transparent'}` }}>
                        <Box component="img" src={url} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ mt: 2 }} />

        {/* 하단 툴바 */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, gap: 1 }}>
          <IconButton size="small" onClick={() => setShowImagePicker(!showImagePicker)} sx={{ color: 'primary.main' }}>
            <AddPhotoAlternateOutlinedIcon />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <Select size="small" value={form.category} onChange={(e) => updateForm('category', e.target.value)}
            sx={{ borderRadius: 2, fontSize: '0.8rem', '.MuiOutlinedInput-notchedOutline': { borderColor: '#e5e5ea' } }}>
            {CATEGORIES.map(c => <MenuItem key={c} value={c} sx={{ fontSize: '0.85rem' }}>{c}</MenuItem>)}
          </Select>
        </Box>

        {/* 태그 입력 */}
        <Box sx={{ px: 2, pb: 2 }}>
          <TextField
            fullWidth size="small" placeholder="태그 입력 (공백으로 구분, 예: UIUX 취업준비)"
            value={form.tags} onChange={(e) => updateForm('tags', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f5f5f7' } }}
          />
        </Box>

        {error && <Alert severity="error" sx={{ mx: 2 }}>{error}</Alert>}
      </Box>
    );
  }

  // ─── 스터디 모집: 단계별 Wizard ───
  const studySteps = ['기본 정보', '이미지 선택', '모집 정보'];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e5e5ea' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 1 }}>
          <IconButton onClick={() => navigate(-1)}><ArrowBackIosNewIcon fontSize="small" /></IconButton>
          <Typography variant="h4" sx={{ flex: 1, textAlign: 'center', fontWeight: 700 }}>스터디 모집 작성</Typography>
          <Button variant="text" sx={{ color: 'primary.main', fontWeight: 700 }} onClick={handleSubmitStudy} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : '완료'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: 2, pt: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Chip label="피드 게시물" onClick={() => setPostType('feed')} variant="outlined"
            sx={{ flex: 1, py: 2, fontWeight: 700 }} />
          <Chip label="스터디 모집" onClick={() => setPostType('study')}
            sx={{ flex: 1, py: 2, fontWeight: 700, bgcolor: 'primary.main', color: 'white' }} />
        </Box>

        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {studySteps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {step === 0 && (
          <Box>
            <TextField fullWidth label="스터디 제목" value={form.title} onChange={(e) => updateForm('title', e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="스터디 소개" multiline rows={4} value={form.caption} onChange={(e) => updateForm('caption', e.target.value)} sx={{ mb: 2 }} />
            <Select fullWidth value={form.category} onChange={(e) => updateForm('category', e.target.value)} sx={{ mb: 2, borderRadius: 3 }}>
              {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
            <TextField fullWidth label="태그 (공백으로 구분)" value={form.tags} onChange={(e) => updateForm('tags', e.target.value)} sx={{ mb: 3 }} />
            <Button fullWidth variant="contained" size="large" onClick={() => setStep(1)} sx={{ py: 1.5 }}>다음</Button>
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="h4">커버 이미지 선택</Typography>
              <IconButton onClick={refreshImages} disabled={imageLoading}><RefreshIcon /></IconButton>
            </Box>
            {imageLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box> : (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 3 }}>
                <Box onClick={() => setSelectedImage('')}
                  sx={{ borderRadius: 2, border: `2px solid ${!selectedImage ? '#007AFF' : '#e5e5ea'}`, aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f7', flexDirection: 'column', gap: 1, cursor: 'pointer' }}>
                  <AddPhotoAlternateOutlinedIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
                  <Typography variant="caption" color="text.secondary">없음</Typography>
                </Box>
                {randomImages.map((url, i) => (
                  <Box key={i} onClick={() => setSelectedImage(url)}
                    sx={{ borderRadius: 2, border: `2px solid ${selectedImage === url ? '#007AFF' : 'transparent'}`, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer' }}>
                    <Box component="img" src={url} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </Box>
                ))}
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="outlined" size="large" onClick={() => setStep(0)} sx={{ py: 1.5 }}>이전</Button>
              <Button fullWidth variant="contained" size="large" onClick={() => setStep(2)} sx={{ py: 1.5 }}>다음</Button>
            </Box>
          </Box>
        )}

        {step === 2 && (
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {['online', 'offline', 'both'].map(mode => (
                <Chip key={mode} label={mode === 'online' ? '온라인' : mode === 'offline' ? '오프라인' : '혼합'}
                  onClick={() => updateForm('study_mode', mode)}
                  sx={{ flex: 1, py: 1.5, fontWeight: 600, bgcolor: form.study_mode === mode ? 'primary.main' : 'white', color: form.study_mode === mode ? 'white' : 'text.secondary', border: '1px solid #e5e5ea' }} />
              ))}
            </Box>
            <Select fullWidth value={form.location} onChange={(e) => updateForm('location', e.target.value)} sx={{ mb: 2, borderRadius: 3 }}>
              {REGIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <TextField label="모집 인원" type="number" value={form.max_members} onChange={(e) => updateForm('max_members', e.target.value)} />
              <TextField label="마감일" type="date" value={form.deadline} onChange={(e) => updateForm('deadline', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            </Box>
            <TextField fullWidth label="진행 기간 (예: 3개월)" value={form.duration} onChange={(e) => updateForm('duration', e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="활동 요일 (예: 매주 토요일)" value={form.schedule} onChange={(e) => updateForm('schedule', e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="활동 시간 (예: 오후 2시)" value={form.meeting_time} onChange={(e) => updateForm('meeting_time', e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="지원 자격" value={form.requirements} onChange={(e) => updateForm('requirements', e.target.value)} sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="outlined" size="large" onClick={() => setStep(1)} sx={{ py: 1.5 }}>이전</Button>
              <Button fullWidth variant="contained" size="large" onClick={handleSubmitStudy} disabled={loading} sx={{ py: 1.5 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : '게시하기'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default WritePage;
