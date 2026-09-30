import { useEffect, useState } from "react";
import { getProjectMembers, type MemberRole } from "../api/member.api";
import { useAuthContext } from "../context/AuthContext";

export function useProjectRole(projectId?: string) {
  const { user } = useAuthContext();
  const [role, setRole] = useState<MemberRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!projectId || !user) {
      setRole(null); setLoading(false); return;
    }
    if (user.role === "admin") {
      setRole("admin"); setLoading(false); return;
    }
    setLoading(true);
    getProjectMembers(projectId)
      .then((response) => {
        const members = response.data ?? response;
        const current = Array.isArray(members)
          ? members.find((member) => member.user?._id === user._id)
          : undefined;
        if (active) setRole(current?.role ?? null);
      })
      .catch(() => { if (active) setRole(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [projectId, user]);

  return { role, loading, isAdmin: user?.role === "admin" || role === "admin", isProjectAdmin: user?.role === "admin" || role === "admin" || role === "project_admin" };
}
