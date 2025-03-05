import { useState, useEffect, useRef } from "react";
import { User } from "@/lib/types";

export const useFetchUsers = (excludeIds: string[]) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputQuery, setInputQuery] = useState("");
  const previousExcludeIdsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!inputQuery.trim()) {
      setUsers([]);
      return;
    }

    const excludeIdsString = JSON.stringify(excludeIds.sort());
    const prevExcludeIdsString = JSON.stringify(previousExcludeIdsRef.current.sort());

    if (excludeIdsString !== prevExcludeIdsString) {
      previousExcludeIdsRef.current = [...excludeIds];
    }

    const timer = setTimeout(() => {
      fetchUsers(inputQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputQuery]);

  const fetchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const excludeParams = excludeIds.map((id) => `exclude=${id}`).join("&");
      const res = await fetch(`/api/user?query=${query}&${excludeParams}`);

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Kullanıcıları getirme hatası:", error);
      setError("Kullanıcıları getirirken bir hata oluştu");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    query: inputQuery,
    setQuery: setInputQuery,
  };
};
