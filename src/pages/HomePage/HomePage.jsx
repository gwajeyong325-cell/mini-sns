import { useEffect, useState } from 'react';
import { Box, Chip, CircularProgress, InputAdornment, Tab, Tabs, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';
import StudyCard from '../../components/StudyCard/StudyCard';
import PostCard from '../../components/PostCard/PostCard';
import { supabase } from '../../supabase';

const CATEGORIES = ['전체', 'UI/UX', '브랜딩', '그래픽', '영상편집', '마케팅'];

const MOCK_STUDIES = [
  { id: '1', title: 'UIUX 포트폴리오 스터디 4기 모집', category: 'UIUX', tags: ['#UIUX', '#포트폴리오', '#취업준비'], post_type: 'study', study_mode: 'both', location: '대구', max_members: 8, current_members: 5, deadline: '2026-06-30', status: 'open', likes_count: 24, image_url: 'https://picsum.photos/seed/uiux-study/400/200', users: { display_name: '디자인멘토', avatar_url: '' } },
  { id: '2', title: '브랜드 아이덴티티 디자인 스터디', category: '브랜딩', tags: ['#브랜딩', '#로고', '#아이덴티티'], post_type: 'study', study_mode: 'online', location: '온라인', max_members: 6, current_members: 5, deadline: '2026-06-20', status: 'closing', likes_count: 18, image_url: 'https://picsum.photos/seed/brand-study/400/200', users: { display_name: '브랜드마스터', avatar_url: '' } },
  { id: '3', title: '영상편집 & 모션그래픽 입문 스터디', category: '영상편집', tags: ['#영상편집', '#모션', '#애프터이펙트'], post_type: 'study', study_mode: 'online', location: '온라인', max_members: 10, current_members: 7, deadline: '2026-07-15', status: 'open', likes_count: 31, image_url: 'https://picsum.photos/seed/video-study/400/200', users: { display_name: '모션크리에이터', avatar_url: '' } },
  { id: '4', title: '디지털 마케팅 & SNS 운영 스터디', category: '마케팅', tags: ['#마케팅', '#SNS', '#콘텐츠'], post_type: 'study', study_mode: 'offline', location: '서울', max_members: 5, current_members: 5, deadline: '2026-06-10', status: 'closed', likes_count: 45, image_url: 'https://picsum.photos/seed/marketing-study/400/200', users: { display_name: '마케터박', avatar_url: '' } },
  { id: '5', title: '그래픽 디자인 포트폴리오 완성반', category: '그래픽', tags: ['#그래픽', '#일러스트레이터', '#포토샵'], post_type: 'study', study_mode: 'both', location: '부산', max_members: 8, current_members: 3, deadline: '2026-07-31', status: 'open', likes_count: 15, image_url: 'https://picsum.photos/seed/graphic-study/400/200', users: { display_name: '그래픽고수', avatar_url: '' } },
];

const MOCK_POSTS = [
  { id: 'p1', title: '피그마 오토레이아웃 꿀팁 공유합니다', caption: '오토레이아웃을 제대로 활용하면 디자인 속도가 2배는 빨라져요. 제가 실무에서 쓰는 꿀팁들을 공유해 드릴게요!', category: 'UIUX', tags: ['#피그마', '#UIUX', '#꿀팁'], post_type: 'feed', likes_count: 42, comments_count: 8, created_at: new Date(Date.now() - 3600000).toISOString(), image_url: 'https://picsum.photos/seed/figma-tip/400/300', users: { display_name: 'UX리서처김', avatar_url: '' } },
  { id: 'p2', title: '브랜딩 프로젝트 후기 — 로컬 카페 리브랜딩', caption: '3개월간 진행한 로컬 카페 리브랜딩 프로젝트 후기입니다. 처음부터 끝까지 혼자 진행하면서 많이 배웠어요.', category: '브랜딩', tags: ['#브랜딩', '#리브랜딩', '#포트폴리오'], post_type: 'feed', likes_count: 89, comments_count: 21, created_at: new Date(Date.now() - 7200000).toISOString(), image_url: 'https://picsum.photos/seed/cafe-brand/400/300', users: { display_name: '브랜드디자이너이', avatar_url: '' } },
  { id: 'p3', title: '취준생 필독 — 포트폴리오 첫 페이지 구성법', caption: '포트폴리오를 100개 이상 검토하면서 느낀 점들을 정리했습니다. 첫 인상이 얼마나 중요한지 알려드릴게요.', category: '마케팅', tags: ['#취업', '#포트폴리오', '#자기소개'], post_type: 'feed', likes_count: 156, comments_count: 34, created_at: new Date(Date.now() - 86400000).toISOString(), image_url: '', users: { display_name: '현직디자이너최', avatar_url: '' } },
];

function HomePage() {
  const [tabValue, setTabValue] = useState(0);
  const [category, setCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [studies, setStudies] = useState(MOCK_STUDIES);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [tabValue]);

  async function fetchContent() {
    setLoading(true);
    try {
      if (tabValue === 0) {
        const { data } = await supabase.from('posts').select('*, users(display_name, avatar_url)').eq('post_type', 'study').order('created_at', { ascending: false }).limit(10);
        if (data && data.length > 0) setStudies(data);
      } else {
        const { data } = await supabase.from('posts').select('*, users(display_name, avatar_url)').eq('post_type', 'feed').order('created_at', { ascending: false }).limit(20);
        if (data && data.length > 0) setPosts(data);
      }
    } catch (e) {
      // 에러 시 mock 데이터 유지
    }
    setLoading(false);
  }

  const filteredStudies = studies.filter(s => {
    const matchCategory = category === '전체' || s.category === category || s.category === category.replace('/', '');
    const matchSearch = !searchQuery || s.title.includes(searchQuery) || (s.tags || []).some(t => t.includes(searchQuery));
    return matchCategory && matchSearch;
  });

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      <TopBar />

      {/* 검색바 */}
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <TextField
          fullWidth
          placeholder="스터디, 주제, 태그 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><TuneIcon sx={{ color: 'text.secondary', fontSize: 20, cursor: 'pointer' }} /></InputAdornment>,
            }
          }}
          sx={{ bgcolor: 'white', borderRadius: 3 }}
        />
      </Box>

      {/* 탭 */}
      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ px: 2, '& .MuiTab-root': { fontWeight: 600, minWidth: 0 }, '& .Mui-selected': { color: 'primary.main' } }}>
        <Tab label="스터디 모집" />
        <Tab label="커뮤니티 피드" />
      </Tabs>

      {tabValue === 0 && (
        <>
          {/* 카테고리 필터 */}
          <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 1, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setCategory(cat)}
                size="small"
                sx={{
                  flexShrink: 0,
                  fontWeight: 600,
                  bgcolor: category === cat ? 'primary.main' : 'white',
                  color: category === cat ? 'white' : 'text.secondary',
                  border: `1px solid ${category === cat ? '#007AFF' : '#e5e5ea'}`,
                }}
              />
            ))}
          </Box>

          {/* 인기 스터디 섹션 */}
          <Box sx={{ px: 2, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Box sx={{ width: 4, height: 18, bgcolor: '#FF9500', borderRadius: 2 }} />
              <Typography variant="h4">인기 스터디</Typography>
            </Box>
            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box> :
              filteredStudies.filter(s => s.status === 'open' || s.status === 'closing').slice(0, 2).map((post) => (
                <StudyCard key={post.id} post={post} />
              ))
            }
          </Box>

          {/* 전체 스터디 */}
          <Box sx={{ px: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Box sx={{ width: 4, height: 18, bgcolor: 'primary.main', borderRadius: 2 }} />
              <Typography variant="h4">전체 스터디 모집</Typography>
            </Box>
            {filteredStudies.map((post) => (
              <StudyCard key={post.id} post={post} />
            ))}
            {filteredStudies.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="text.secondary">검색 결과가 없어요</Typography>
              </Box>
            )}
          </Box>
        </>
      )}

      {tabValue === 1 && (
        <Box sx={{ px: 2, pt: 1.5 }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Box>
      )}

      <BottomBar />
    </Box>
  );
}

export default HomePage;
