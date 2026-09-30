import { useEffect, useState } from "react";
import { getProjectMembers, type MemberRole } from "../api/member.api";
import { useAuthContext } from "../context/AuthContext";

export function useProjectRole(projectId?: string) {
  const { user } = useAuthContext();
  const [role, setRole] = useState<MemberRole | null>(null);
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    let active = true;
    if (!projectId || !user || isAdmin) {
      return;
    }
    getProjectMembers(projectId)
      .then((response) => {
        const members = response.data ?? response;
        const current = Array.isArray(members)
          ? members.find((member) => member.user?._id === user._id)
          : undefined;
        if (active) setRole(current?.role ?? null);
      })
      .catch(() => {
        if (active) setRole(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [projectId, user, isAdmin]);

  const currentRole = !projectId || !user ? null : isAdmin ? "admin" : role;

  return {
    role: currentRole,
    loading: Boolean(projectId && user && !isAdmin && loading),
    isAdmin: isAdmin || role === "admin",
    isProjectAdmin:
      isAdmin || role === "admin" || role === "project_admin",
  };
}
