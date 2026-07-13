export type UserRole = "intern" | "company";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type InternProfile = {
  id?: number;
  school_name: string;
  graduation_year: number | null;
  bio: string;
  skills: string;
  desired_position: string;
};

export type Intern = {
  id: number;
  name: string;
  email: string;
  is_favorited?: boolean;
  profile: Omit<InternProfile, "id"> | null;
};

export type ScoutMessage = {
  id: number;
  body: string;
  read_at: string | null;
  created_at: string;
  sender: AuthUser;
  receiver: AuthUser;
};

export type JobPost = {
  id: number;
  title: string;
  description: string;
  required_skills: string;
  location: string;
  is_active: boolean;
  is_saved?: boolean;
  created_at: string;
  company: {
    id: number;
    name: string;
    email: string;
  };
};

type ApiError = {
  errors?: string[];
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = (await response.json()) as T & ApiError;

  if (!response.ok) {
    throw new Error(data.errors?.join(", ") || "API request failed");
  }

  return data;
}

export function registerUser(params: {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  role: UserRole;
}) {
  return request<AuthResponse>("/api/v1/register", {
    method: "POST",
    body: JSON.stringify({
      user: {
        name: params.name,
        email: params.email,
        password: params.password,
        password_confirmation: params.passwordConfirmation,
        role: params.role,
      },
    }),
  });
}

export function loginUser(params: { email: string; password: string }) {
  return request<AuthResponse>("/api/v1/login", {
    method: "POST",
    body: JSON.stringify({
      user: {
        email: params.email,
        password: params.password,
      },
    }),
  });
}

export function saveAuth(auth: AuthResponse) {
  localStorage.setItem("authToken", auth.token);
  localStorage.setItem("authUser", JSON.stringify(auth.user));
}

export function getSavedAuth() {
  const token = localStorage.getItem("authToken");
  const userJson = localStorage.getItem("authUser");

  if (!token || !userJson) {
    return null;
  }

  return {
    token,
    user: JSON.parse(userJson) as AuthUser,
  };
}

export function clearAuth() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
}

export function getInternProfile(token: string) {
  return request<{ intern_profile: InternProfile | null }>("/api/v1/intern_profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateInternProfile(token: string, profile: InternProfile) {
  return request<{ intern_profile: InternProfile }>("/api/v1/intern_profile", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      intern_profile: {
        school_name: profile.school_name,
        graduation_year: profile.graduation_year,
        bio: profile.bio,
        skills: profile.skills,
        desired_position: profile.desired_position,
      },
    }),
  });
}

export function getInterns(token: string) {
  return request<{ interns: Intern[] }>("/api/v1/interns", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getIntern(token: string, id: string) {
  return request<{ intern: Intern }>(`/api/v1/interns/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createMessage(token: string, params: { receiverId: number; body: string }) {
  return request<{ message: ScoutMessage }>("/api/v1/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message: {
        receiver_id: params.receiverId,
        body: params.body,
      },
    }),
  });
}

export function getMessages(token: string) {
  return request<{ messages: ScoutMessage[] }>("/api/v1/messages", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getMessage(token: string, id: string) {
  return request<{ message: ScoutMessage }>(`/api/v1/messages/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getJobPosts(
  token: string,
  filters: { keyword?: string; location?: string; skill?: string } = {},
) {
  const searchParams = new URLSearchParams();

  if (filters.keyword) searchParams.set("keyword", filters.keyword);
  if (filters.location) searchParams.set("location", filters.location);
  if (filters.skill) searchParams.set("skill", filters.skill);

  const query = searchParams.toString();

  return request<{ job_posts: JobPost[] }>(`/api/v1/job_posts${query ? `?${query}` : ""}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getJobPost(token: string, id: string) {
  return request<{ job_post: JobPost }>(`/api/v1/job_posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createJobPost(
  token: string,
  params: {
    title: string;
    description: string;
    requiredSkills: string;
    location: string;
  },
) {
  return request<{ job_post: JobPost }>("/api/v1/job_posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      job_post: {
        title: params.title,
        description: params.description,
        required_skills: params.requiredSkills,
        location: params.location,
        is_active: true,
      },
    }),
  });
}

export function favoriteIntern(token: string, internId: number) {
  return request<{ intern: Intern }>("/api/v1/favorite_interns", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ intern_id: internId }),
  });
}

export async function unfavoriteIntern(token: string, internId: number) {
  const response = await fetch(`${API_BASE_URL}/api/v1/favorite_interns/${internId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }
}

export function getFavoriteInterns(token: string) {
  return request<{ interns: Intern[] }>("/api/v1/favorite_interns", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function saveJobPost(token: string, jobPostId: number) {
  return request<{ job_post: JobPost }>("/api/v1/saved_job_posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ job_post_id: jobPostId }),
  });
}

export async function unsaveJobPost(token: string, jobPostId: number) {
  const response = await fetch(`${API_BASE_URL}/api/v1/saved_job_posts/${jobPostId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }
}

export function getSavedJobPosts(token: string) {
  return request<{ job_posts: JobPost[] }>("/api/v1/saved_job_posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
