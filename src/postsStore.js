const KEY = 'mate_local_posts';

export function getLocalPosts() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function addLocalPost(post) {
  const posts = getLocalPosts();
  posts.unshift(post);
  localStorage.setItem(KEY, JSON.stringify(posts.slice(0, 100)));
  return post;
}

export function toggleLocalLike(postId) {
  const liked = JSON.parse(localStorage.getItem('mate_likes') || '[]');
  const isLiked = liked.includes(postId);
  const next = isLiked ? liked.filter(id => id !== postId) : [...liked, postId];
  localStorage.setItem('mate_likes', JSON.stringify(next));
  return !isLiked;
}

export function getLocalLikes() {
  try {
    return JSON.parse(localStorage.getItem('mate_likes') || '[]');
  } catch {
    return [];
  }
}
