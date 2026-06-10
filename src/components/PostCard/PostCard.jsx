import { Avatar, Box, Card, CardContent, CardMedia, Chip, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_COLORS = {
  UIUX: '#007AFF',
  브랜딩: '#FF2D55',
  그래픽: '#5856D6',
  영상편집: '#FF9500',
  마케팅: '#34C759',
  기타: '#8e8e93',
  general: '#8e8e93',
};

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  const navigate = useNavigate();
  const categoryColor = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.general;
  const defaultImage = `https://picsum.photos/seed/${post.id}post/400/300`;
  const imageUrl = post.image_url || defaultImage;

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
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

  return (
    <Card onClick={() => navigate(`/post/${post.id}`)} sx={{ cursor: 'pointer', mb: 1.5 }}>
      {post.image_url && (
        <CardMedia
          component="img"
          height={200}
          image={imageUrl}
          alt={post.title}
          sx={{ objectFit: 'cover' }}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${post.id}post/400/300`; }}
        />
      )}
      <CardContent sx={{ p: 2, pb: '12px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={post.users?.avatar_url || `https://api.dicebear.com/7.x/thumbs/svg?seed=${post.user_id}`}
              sx={{ width: 32, height: 32 }}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {post.users?.display_name || '익명'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {timeAgo(post.created_at)}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={post.category}
            size="small"
            sx={{ bgcolor: `${categoryColor}15`, color: categoryColor, fontWeight: 600, fontSize: '0.7rem' }}
          />
        </Box>

        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{post.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1.5 }}>
          {post.caption}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {(post.tags || []).slice(0, 3).map((tag) => (
            <Typography key={tag} variant="caption" sx={{ color: 'primary.main' }}>{tag}</Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={handleLike} sx={{ color: liked ? 'error.main' : 'text.secondary', p: 0.5 }}>
            {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
          <Typography variant="caption" color="text.secondary">{likeCount}</Typography>
          <IconButton size="small" sx={{ color: 'text.secondary', p: 0.5, ml: 0.5 }}>
            <ChatBubbleOutlineOutlinedIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" color="text.secondary">{post.comments_count || 0}</Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }} sx={{ color: bookmarked ? 'primary.main' : 'text.secondary', p: 0.5 }}>
            {bookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export default PostCard;
