import { useState } from 'react';
import { Box, Button, Chip, Divider, IconButton, InputAdornment, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const INTERESTS = ['UI/UX', '브랜딩', '그래픽', '영상편집', '마케팅', '포트폴리오', '취업준비', '공모전'];

function LoginPage() {
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, updateProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) { setError('이메일과 비밀번호를 입력해 주세요.'); return; }
    setLoading(true);
    setError('');
    await signIn(email, password);
    setLoading(false);
    navigate('/');
  };

  const handleSignUp = async () => {
    if (step === 1) {
      if (!email || !password || !displayName) { setError('모든 항목을 입력해 주세요.'); return; }
      if (password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
      setStep(2);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await signUp(email, password, displayName);
    if (error) { setError(error.message); setLoading(false); return; }
    if (selectedInterests.length > 0) {
      await updateProfile({ interests: selectedInterests });
    }
    setLoading(false);
    navigate('/');
  };

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Box sx={{ width: '100%', maxWidth: 400, bgcolor: 'white', borderRadius: 3, p: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        {/* 로고 */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h1" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>MATE</Typography>
          <Typography variant="body2" color="text.secondary">함께 성장하는 디자인&마케팅 스터디 플랫폼</Typography>
        </Box>

        {/* 탭 */}
        <Box sx={{ display: 'flex', bgcolor: '#f5f5f7', borderRadius: 2, p: 0.5, mb: 3 }}>
          {['login', 'signup'].map((m) => (
            <Button
              key={m}
              fullWidth
              variant={mode === m ? 'contained' : 'text'}
              onClick={() => { setMode(m); setStep(1); setError(''); }}
              sx={{ py: 1, fontSize: '0.875rem', color: mode === m ? 'white' : 'text.secondary' }}
            >
              {m === 'login' ? '로그인' : '회원가입'}
            </Button>
          ))}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        {mode === 'login' ? (
          <>
            <TextField fullWidth label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
            <TextField
              fullWidth label="비밀번호" type={showPassword ? 'text' : 'password'}
              value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              sx={{ mb: 3 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <Button fullWidth variant="contained" size="large" onClick={handleLogin} disabled={loading} sx={{ py: 1.5, mb: 2 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
            </Button>
            <Divider sx={{ my: 2 }}><Typography variant="caption" color="text.secondary">또는</Typography></Divider>
            <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} sx={{ py: 1.5, borderColor: '#e5e5ea', color: 'text.primary', mb: 1 }}>
              Google로 로그인
            </Button>
            <Button fullWidth variant="outlined" sx={{ py: 1.5, borderColor: '#FEE500', bgcolor: '#FEE500', color: '#000', '&:hover': { bgcolor: '#FDD835' } }}>
              카카오로 로그인
            </Button>
          </>
        ) : (
          <>
            {step === 1 ? (
              <>
                <TextField fullWidth label="닉네임" value={displayName} onChange={(e) => setDisplayName(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
                <TextField
                  fullWidth label="비밀번호 (6자 이상)" type={showPassword ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 3 }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
                <Button fullWidth variant="contained" size="large" onClick={handleSignUp} sx={{ py: 1.5 }}>다음</Button>
              </>
            ) : (
              <>
                <Typography variant="h4" sx={{ mb: 0.5 }}>관심 분야를 선택해 주세요</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>선택한 분야를 기반으로 스터디를 추천해 드려요</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                  {INTERESTS.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      onClick={() => toggleInterest(interest)}
                      variant={selectedInterests.includes(interest) ? 'filled' : 'outlined'}
                      sx={{
                        borderColor: 'primary.main',
                        color: selectedInterests.includes(interest) ? 'white' : 'primary.main',
                        bgcolor: selectedInterests.includes(interest) ? 'primary.main' : 'transparent',
                      }}
                    />
                  ))}
                </Box>
                <Button fullWidth variant="contained" size="large" onClick={handleSignUp} disabled={loading} sx={{ py: 1.5 }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : '시작하기'}
                </Button>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default LoginPage;
