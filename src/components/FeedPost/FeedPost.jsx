import { useState } from 'react';
import { Avatar, Box, Divider, IconButton, Typography, Chip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { useNavigate } from 'react-router-dom';
import { toggleLocalLike, getLocalLikes } from '../../postsStore';

const CATEGORY_COLORS = {
  UIUX: '#007AFF', 브랜딩: '#FF2D55', 그래픽: '#5856D6',
  영상편집: '#FF9500', 마케팅: '#34C759', 기타: '#8e8e93', general: '#8e8e93',
};

function FeedPost({ post, hideDivider }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(() => getLocalLikes().includes(post.id));
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  const [bookmarked, setBookmarked] = useState(false);
  const categoryColor = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.general;

  const handleLike = (e) => {
    e.stopPropagation();
    const nowLiked = toggleLocalLike(post.id);
    setLiked(nowLiked);
    setLikeCount(prev => nowLiked ? prev + 1 : prev - 1);
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '방금';
    if (mins < 60) return `${mins}분`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}시간`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일`;
    return new Date(dateStr).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <Box>
      <Box
        onClick={() => navigate(`/post/${post.id}`)}
        sx={{ display: 'flex', gap: 1.5, px: 2, py: 1.5, cursor: 'pointer', '&:hover': { bgcolor: '#fafafa' }, transition: '0.15s' }}
      >
        {/* 아바타 */}
        <Avatar
          src={post.users?.avatar_url || `https://api.dicebear.com/7.x/thumbs/svg?seed=${post.user_id}`}
          sx={{ width: 40, height: 40, flexShrink: 0, mt: 0.25 }}
        />

        {/* 콘텐츠 */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* 헤더: 이름 · 시간 · 카테고리 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
              {post.users?.display_name || '익명'}
            </Typography>
            <Typography variant="caption" color="text.secondary">·</Typography>
            <Typography variant="caption" color="text.secondary">{timeAgo(post.created_at)}</Typography>
            <Box sx={{ flex: 1 }} />
            <Chip
              label={post.category}
              size="small"
              sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: `${categoryColor}15`, color: categoryColor, px: 0.5 }}
            />
          </Box>

          {/* 본문 */}
          <Typography variant="body2" sx={{ lineHeight: 1.6, mb: post.image_url ? 1 : 0, whiteSpace: 'pre-line', color: '#1c1c1e' }}>
            {post.caption}
          </Typography>

          {/* 태그 */}
          {(post.tags || []).length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: post.image_url ? 0.75 : 0.5 }}>
              {(post.tags || []).map(tag => (
                <Typography key={tag} variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>{tag}</Typography>
              ))}
            </Box>
          )}

          {/* 이미지 */}
          {post.image_url && (
            <Box
              component="img"
              src={post.image_url}
              alt=""
              sx={{ width: '100%', borderRadius: 3, mt: 0.5, maxHeight: 300, objectFit: 'cover', display: 'block', border: '1px solid #e5e5ea' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}

          {/* 액션 버튼 */}
          <Box sx={{ display: 'flex', mt: 1, mx: -1 }} onClick={(e) => e.stopPropagation()}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <IconButton size="small" onClick={handleLike} sx={{ color: liked ? 'error.main' : 'text.secondary', p: 0.75 }}>
                {liked ? <FavoriteIcon sx={{ fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
              </IconButton>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.25 }}>{likeCount || ''}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <IconButton size="small" sx={{ color: 'text.secondary', p: 0.75 }} onClick={() => navigate(`/post/${post.id}`)}>
                <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.25 }}>{post.comments_count || ''}</Typography>
            </Box>

            <IconButton size="small" sx={{ color: 'text.secondary', p: 0.75 }}>
              <ShareOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <Box sx={{ flex: 1 }} />

            <IconButton size="small" onClick={() => setBookmarked(!bookmarked)} sx={{ color: bookmarked ? 'primary.main' : 'text.secondary', p: 0.75 }}>
              {bookmarked ? <BookmarkIcon sx={{ fontSize: 18 }} /> : <BookmarkBorderIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Box>
        </Box>
      </Box>
      {!hideDivider && <Divider />}
    </Box>
  );
}

export default FeedPost;
