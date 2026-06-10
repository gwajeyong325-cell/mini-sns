import { useState } from 'react';
import {
  Box, Button, Chip, CircularProgress, IconButton, MenuItem,
  Select, Step, StepLabel, Stepper, TextField, Typography, Paper, Alert
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useAuth } from '../../AuthContext';

const CATEGORIES = ['UIUX', '브랜딩', '그래픽', '영상편집', '마케팅', '기타'];
const REGIONS = ['온라인', '서울', '경기', '인천', '부산', '대구', '광주', '대전', '기타'];

const UNSPLASH_KEYWORDS = ['design', 'study', 'workspace', 'creative', 'team', 'portfolio'];

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
  'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600',
  'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=600',
  'https://images.unsplash.com/photo-1536240478700-b869ad10e128?w=600',
  'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600',
  'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=600',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600',
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600',
];

function WritePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [postType, setPostType] = useState('study');
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [randomImages, setRandomImages] = useState(FALLBACK_IMAGES.slice(0, 6));
  const [selectedImage, setSelectedImage] = useState('');

  const [form, setForm] = useState({
    title: '', caption: '', category: 'UIUX', tags: '',
    study_mode: 'online', location: '온라인',
    max_members: 8, deadline: '', duration: '',
    schedule: '', meeting_time: '', requirements: '', goals: '',
  });

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const refreshImages = () => {
    setImageLoading(true);
    const shuffled = [...FALLBACK_IMAGES].sort(() => Math.random() - 0.5).slice(0, 6);
    setTimeout(() => { setRandomImages(shuffled); setImageLoading(false); }, 400);
  };

  const handleSubmit = async () => {
    if (!user) { navigate('/login'); return; }
    if (!form.title.trim() || !form.caption.trim()) { setError('제목과 내용을 입력해 주세요.'); return; }
    setLoading(true);
    setError('');
    const tags = form.tags.split(' ').filter(t => t.trim()).map(t => t.startsWith('#') ? t : `#${t}`);
    const payload = {
      user_id: user.id,
      title: form.title,
      caption: form.caption,
      category: form.category,
      tags,
      post_type: postType,
      image_url: selectedImage || '',
      ...(postType === 'study' ? {
        study_mode: form.study_mode,
        location: form.location,
        max_members: Number(form.max_members),
        deadline: form.deadline || null,
        duration: form.duration,
        schedule: form.schedule,
        meeting_time: form.meeting_time,
        requirements: form.requirements,
        goals: form.goals,
        status: 'open',
      } : {}),
    };
    const { data, error: err } = await supabase.from('posts').insert(payload).select().single();
    setLoading(false);
    if (err) { setError(err.message); return; }
    navigate(data ? `/post/${data.id}` : '/');
  };

  const steps = postType === 'study' ? ['기본 정보', '이미지 선택', '모집 정보'] : ['내용 작성', '이미지 선택'];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
      {/* 헤더 */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e5e5ea' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 1 }}>
          <IconButton onClick={() => navigate(-1)}><ArrowBackIosNewIcon fontSize="small" /></IconButton>
          <Typography variant="h4" sx={{ flex: 1, textAlign: 'center', fontWeight: 700 }}>게시물 작성</Typography>
          <Button variant="text" sx={{ color: 'primary.main', fontWeight: 700 }} onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : '완료'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: 2, pt: 2 }}>
        {/* 게시물 타입 선택 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          {['study', 'feed'].map(type => (
            <Chip key={type} label={type === 'study' ? '스터디 모집' : '피드 게시물'}
              onClick={() => { setPostType(type); setStep(0); }}
              sx={{ flex: 1, py: 2, fontWeight: 700, bgcolor: postType === type ? 'primary.main' : 'white', color: postType === type ? 'white' : 'text.secondary', border: '1px solid #e5e5ea' }}
            />
          ))}
        </Box>

        {/* 스텝 표시 */}
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Step 0: 기본 정보 */}
        {step === 0 && (
          <Box>
            <TextField fullWidth label="제목" value={form.title} onChange={(e) => updateForm('title', e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="내용" multiline rows={5} value={form.caption} onChange={(e) => updateForm('caption', e.target.value)} sx={{ mb: 2 }} />
            <Select fullWidth value={form.category} onChange={(e) => updateForm('category', e.target.value)} sx={{ mb: 2, borderRadius: 3 }}>
              {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
            <TextField fullWidth label="태그 (공백으로 구분, 예: UIUX 포트폴리오)" value={form.tags} onChange={(e) => updateForm('tags', e.target.value)} sx={{ mb: 3 }} />
            <Button fullWidth variant="contained" size="large" onClick={() => setStep(1)} sx={{ py: 1.5 }}>다음</Button>
          </Box>
        )}

        {/* Step 1: 이미지 선택 */}
        {step === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="h4">이미지 선택</Typography>
              <IconButton onClick={refreshImages} disabled={imageLoading}>
                <RefreshIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>마음에 드는 이미지를 선택하세요 (선택 사항)</Typography>

            {imageLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 3 }}>
                <Box
                  onClick={() => setSelectedImage('')}
                  sx={{ borderRadius: 2, border: `2px solid ${!selectedImage ? '#007AFF' : '#e5e5ea'}`, overflow: 'hidden', cursor: 'pointer', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f7', flexDirection: 'column', gap: 1 }}
                >
                  <AddPhotoAlternateOutlinedIcon sx={{ color: 'text.secondary', fontSize: 32 }} />
                  <Typography variant="caption" color="text.secondary">이미지 없음</Typography>
                </Box>
                {randomImages.map((url, i) => (
                  <Box
                    key={i}
                    onClick={() => setSelectedImage(url)}
                    sx={{ borderRadius: 2, border: `2px solid ${selectedImage === url ? '#007AFF' : 'transparent'}`, overflow: 'hidden', cursor: 'pointer', aspectRatio: '4/3' }}
                  >
                    <Box component="img" src={url} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="outlined" size="large" onClick={() => setStep(0)} sx={{ py: 1.5 }}>이전</Button>
              {postType === 'study' ? (
                <Button fullWidth variant="contained" size="large" onClick={() => setStep(2)} sx={{ py: 1.5 }}>다음</Button>
              ) : (
                <Button fullWidth variant="contained" size="large" onClick={handleSubmit} disabled={loading} sx={{ py: 1.5 }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : '게시하기'}
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* Step 2: 모집 정보 (study only) */}
        {step === 2 && postType === 'study' && (
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {['online', 'offline', 'both'].map(mode => (
                <Chip key={mode} label={mode === 'online' ? '온라인' : mode === 'offline' ? '오프라인' : '혼합'}
                  onClick={() => updateForm('study_mode', mode)}
                  sx={{ flex: 1, py: 1.5, fontWeight: 600, bgcolor: form.study_mode === mode ? 'primary.main' : 'white', color: form.study_mode === mode ? 'white' : 'text.secondary', border: '1px solid #e5e5ea' }}
                />
              ))}
            </Box>

            <Select fullWidth value={form.location} onChange={(e) => updateForm('location', e.target.value)} sx={{ mb: 2, borderRadius: 3 }}>
              {REGIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <TextField label="모집 인원" type="number" value={form.max_members} onChange={(e) => updateForm('max_members', e.target.value)} />
              <TextField label="마감일" type="date" value={form.deadline} onChange={(e) => updateForm('deadline', e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }} />
            </Box>

            <TextField fullWidth label="진행 기간 (예: 3개월)" value={form.duration} onChange={(e) => updateForm('duration', e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="활동 요일 (예: 매주 토요일)" value={form.schedule} onChange={(e) => updateForm('schedule', e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="활동 시간 (예: 오후 2시)" value={form.meeting_time} onChange={(e) => updateForm('meeting_time', e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="지원 자격" value={form.requirements} onChange={(e) => updateForm('requirements', e.target.value)} sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="outlined" size="large" onClick={() => setStep(1)} sx={{ py: 1.5 }}>이전</Button>
              <Button fullWidth variant="contained" size="large" onClick={handleSubmit} disabled={loading} sx={{ py: 1.5 }}>
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
