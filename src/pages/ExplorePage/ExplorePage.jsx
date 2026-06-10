import { useState } from 'react';
import { Box, Chip, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';
import StudyCard from '../../components/StudyCard/StudyCard';

const CATEGORIES = [
  { label: 'UI/UX', emoji: '🎨', color: '#007AFF' },
  { label: '브랜딩', emoji: '✨', color: '#FF2D55' },
  { label: '그래픽', emoji: '🖌️', color: '#5856D6' },
  { label: '영상편집', emoji: '🎬', color: '#FF9500' },
  { label: '마케팅', emoji: '📊', color: '#34C759' },
  { label: '포트폴리오', emoji: '💼', color: '#007AFF' },
];

const MOCK_STUDIES = [
  { id: 's1', title: 'Figma 마스터 클래스 스터디', category: 'UIUX', tags: ['#피그마', '#UI디자인'], post_type: 'study', study_mode: 'online', location: '온라인', max_members: 8, current_members: 4, deadline: '2026-07-10', status: 'open', likes_count: 22, image_url: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=800' },
  { id: 's2', title: '로고 디자인 A to Z', category: '브랜딩', tags: ['#로고', '#브랜딩'], post_type: 'study', study_mode: 'online', location: '온라인', max_members: 6, current_members: 2, deadline: '2026-07-20', status: 'open', likes_count: 15, image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800' },
  { id: 's3', title: '콘텐츠 마케팅 실전반', category: '마케팅', tags: ['#콘텐츠', '#인스타'], post_type: 'study', study_mode: 'offline', location: '서울', max_members: 5, current_members: 3, deadline: '2026-06-25', status: 'closing', likes_count: 38, image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800' },
];

function ExplorePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const filtered = MOCK_STUDIES.filter(s => {
    const matchCat = !activeCategory || s.category === activeCategory || s.category.replace('/', '') === activeCategory;
    const matchSearch = !search || s.title.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      <TopBar title="MATE 찾기" />

      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <TextField
          fullWidth
          placeholder="스터디 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> } }}
          sx={{ bgcolor: 'white', borderRadius: 3 }}
        />
      </Box>

      {/* 카테고리 그리드 */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="h4" sx={{ mb: 1.5 }}>카테고리</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 3 }}>
          {CATEGORIES.map((cat) => (
            <Box
              key={cat.label}
              onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
              sx={{
                bgcolor: activeCategory === cat.label ? cat.color : 'white',
                borderRadius: 3,
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                border: `2px solid ${activeCategory === cat.label ? cat.color : '#e5e5ea'}`,
                transition: '0.2s',
              }}
            >
              <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>{cat.emoji}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: activeCategory === cat.label ? 'white' : 'text.primary' }}>
                {cat.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="h4" sx={{ mb: 1.5 }}>
          {activeCategory ? `${activeCategory} 스터디` : '추천 스터디'}
        </Typography>
        {filtered.map((post) => <StudyCard key={post.id} post={post} />)}
        {filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">해당 카테고리의 스터디가 없어요</Typography>
          </Box>
        )}
      </Box>

      <BottomBar />
    </Box>
  );
}

export default ExplorePage;
