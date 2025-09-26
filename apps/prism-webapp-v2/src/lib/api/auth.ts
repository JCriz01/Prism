export type LoginPayload = { username: string; password: string };

export async function loginFn(payload: LoginPayload) {
  const res = await fetch("http://localhost:5200/api/users/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    const message = data.message || "Invalid username or password";
    throw new Error(message);
  }
  return data as {
    token: string;
    user: {
      username: string;
      name: string;
      email: string;
      avatarUrl?: string | null;
    };
  };
}

export async function session() {
  const res = await fetch("http://localhost:5200/api/users/session", {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error("Not authenticated");
  }
  return res.json();
}
