import { Box, Card, CardContent, CardMedia, Chip, IconButton, Typography } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  open: { label: '모집 중', color: '#30B0C7', bg: '#E8F7FA' },
  closing: { label: '마감 임박', color: '#FF9500', bg: '#FFF4E5' },
  closed: { label: '모집 완료', color: '#8e8e93', bg: '#f2f2f7' },
};

const CATEGORY_COLORS = {
  UIUX: '#007AFF',
  브랜딩: '#FF2D55',
  그래픽: '#5856D6',
  영상편집: '#FF9500',
  마케팅: '#34C759',
  기타: '#8e8e93',
};

function StudyCard({ post }) {
  const [bookmarked, setBookmarked] = useState(false);
  const navigate = useNavigate();
  const status = STATUS_CONFIG[post.status] || STATUS_CONFIG.open;
  const categoryColor = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.기타;

  const defaultImage = `https://picsum.photos/seed/${post.id}/400/200`;
  const imageUrl = post.image_url || defaultImage;

  return (
    <Card
      onClick={() => navigate(`/post/${post.id}`)}
      sx={{ cursor: 'pointer', mb: 2, overflow: 'hidden', '&:hover': { transform: 'translateY(-2px)', transition: '0.2s' } }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia component="img" height={160} image={imageUrl} alt={post.title} sx={{ objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
          <Chip
            label={status.label}
            size="small"
            sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: '0.7rem', border: `1px solid ${status.color}` }}
          />
          <Chip
            label={post.category}
            size="small"
            sx={{ bgcolor: '#ffffff', color: categoryColor, fontWeight: 700, fontSize: '0.7rem' }}
          />
        </Box>
        <IconButton
          onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' }, p: 0.75 }}
        >
          {bookmarked ? <BookmarkIcon sx={{ fontSize: 20, color: 'primary.main' }} /> : <BookmarkBorderIcon sx={{ fontSize: 20 }} />}
        </IconButton>
      </Box>

      <CardContent sx={{ p: 2, pb: '12px !important' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {(post.tags || []).slice(0, 3).map((tag) => (
            <Typography key={tag} variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>{tag}</Typography>
          ))}
        </Box>
        <Typography variant="h4" sx={{ mb: 1.5, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleAltOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {post.current_members || 0} / {post.max_members || 0}명
            </Typography>
          </Box>
          {post.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">{post.location}</Typography>
            </Box>
          )}
          {post.deadline && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(post.deadline).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 마감
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default StudyCard;
