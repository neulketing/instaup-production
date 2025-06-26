import bcrypt from 'bcryptjs';

async function generatePasswordHash() {
  try {
    // 테스트 사용자 비밀번호: password123
    const userPasswordHash = await bcrypt.hash('password123', 10);
    console.log('User password hash (password123):', userPasswordHash);

    // 관리자 비밀번호: smfzpxld1!
    const adminPasswordHash = await bcrypt.hash('smfzpxld1!', 10);
    console.log('Admin password hash (smfzpxld1!):', adminPasswordHash);

    console.log('\n=== Supabase SQL 업데이트 쿼리 ===');
    console.log(`UPDATE users SET password_hash = '${userPasswordHash}' WHERE email = 'user@example.com';`);
    console.log(`UPDATE users SET password_hash = '${adminPasswordHash}' WHERE email = 'neulketing@gmail.com';`);

  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generatePasswordHash();
