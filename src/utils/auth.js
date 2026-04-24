import supabase from '../supabaseClient'

/**
 * Fetches user role from Supabase user table
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<string>} - User role ('student' or 'mentor'), defaults to 'student'
 */
export async function fetchUserRole(email) {
  try {
    console.log('🔍 fetchUserRole called with email:', email);

    const { data, error } = await supabase
      .from('users')
      .select('user_id, role')
      .ilike('email', email)
      .maybeSingle();

    console.log('📊 Users table response:', { data, error });

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    if (!data) {
      console.warn('⚠️ No user data found for email:', email);
      return null;
    }

    // Store user_id in localStorage
    console.log('💾 Storing user_id in localStorage:', data.user_id);
    localStorage.setItem('auth_id', data.user_id);

    // Verify it was stored
    const stored = localStorage.getItem('auth_id');
    console.log('✅ Verified auth_id in localStorage:', stored);

    // Return only the role
    return data.role;
  } catch (err) {
    console.error('Unexpected error fetching user role:', err);
    return null;
  }
}


/**
 * Stores user authentication data in localStorage
 * @param {Object} userData - User data object with id and role
 */
export function storeAuthData(userData) {
  if (userData?.id && userData?.role) {
    localStorage.setItem('auth_user_id', userData.id)
    localStorage.setItem('auth_user_role', userData.role)
  }
}

/**
 * Retrieves stored authentication data from localStorage
 * @returns {Object|null} - Object with userId and role, or null if not found
 */
export function getStoredAuthData() {
  const userId = localStorage.getItem('auth_user_id')
  const role = localStorage.getItem('auth_user_role')

  if (userId && role) {
    return { userId, role }
  }
  return null
}

/**
 * Clears stored authentication data from localStorage
 */
export function clearAuthData() {
  localStorage.removeItem('auth_user_id')
  localStorage.removeItem('auth_user_role')
  localStorage.removeItem('auth_id')
}

/**
 * Checks if user is authenticated by verifying Supabase session
 * @returns {Promise<Object|null>} - User object if authenticated, null otherwise
 */
export async function checkAuthSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Error checking auth session:', error)
      return null
    }

    if (session?.user) {
      return session.user
    }

    return null
  } catch (err) {
    console.error('Unexpected error checking auth session:', err)
    return null
  }
}

/**
 * Complete authentication flow: checks session, fetches role, stores data
 * @returns {Promise<Object|null>} - Object with user and role, or null if not authenticated
 */
export async function getAuthenticatedUser() {
  const user = await checkAuthSession()

  if (!user) {
    clearAuthData()
    return null
  }

  // 2️⃣ Fetch the app-specific role from users table
  console.log('User role:', user.email)
  let role = await fetchUserRole(user.email);

  // Fallback: If fetch by email failed, try to fetch by auth_uid (unique ID)
  if (!role) {
    console.log('🕵️ Role not found by email, trying auth_uid lookup...');
    const { data: userRecord } = await supabase
      .from('users')
      .select('user_id, role')
      .eq('auth_uid', user.id)
      .maybeSingle();
      
    if (userRecord) {
      role = userRecord.role;
      localStorage.setItem('auth_id', userRecord.user_id);
    }
  }

  if (!role) {
    console.error('Failed to fetch user role. Please contact support.');
    return null;
  }

  // Store in localStorage for persistence
  storeAuthData({ id: user.id, role })

  return {
    user,
    role
  }
}
