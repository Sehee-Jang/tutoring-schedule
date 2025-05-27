import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<
    { id: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgs = async () => {
      const snapshot = await getDocs(collection(db, "organizations"));
      const orgs = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));
      setOrganizations(orgs);
      setLoading(false);
    };

    fetchOrgs();
  }, []);

  return { organizations, loading };
};
