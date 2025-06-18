import React, { useState, useEffect } from "react";
import { UserRole } from "../../../types/user";

interface OptionItem {
  id: string;
  name: string;
}

export interface FilterValues {
  organizationId: string;
  trackId: string;
  batchId: string;
  searchText: string;
}

interface TutorFilterPanelProps {
  userRole: UserRole;
  organizations: OptionItem[];
  tracks: OptionItem[];
  batches: OptionItem[];
  onFilterChange: (filters: FilterValues) => void;
}

const TutorFilterPanel: React.FC<TutorFilterPanelProps> = ({
  userRole,
  organizations,
  tracks,
  batches,
  onFilterChange,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  useEffect(() => {
    onFilterChange({
      organizationId: selectedOrg || "",
      trackId: selectedTrack || "",
      batchId: selectedBatch || "",
      searchText,
    });
  }, [searchText, selectedOrg, selectedTrack, selectedBatch]);

  return (
    <div className='flex flex-wrap gap-2 mb-4'>
      <input
        type='text'
        placeholder='이름 또는 이메일 검색'
        className='border p-2 rounded w-64'
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {userRole === "super_admin" && (
        <select
          className='border p-2 rounded'
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
        >
          <option value=''>조직 전체</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      )}

      {(userRole === "super_admin" || userRole === "organization_admin") && (
        <select
          className='border p-2 rounded'
          value={selectedTrack}
          onChange={(e) => setSelectedTrack(e.target.value)}
        >
          <option value=''>트랙 전체</option>
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.name}
            </option>
          ))}
        </select>
      )}

      {(userRole === "super_admin" ||
        userRole === "organization_admin" ||
        userRole === "track_admin") && (
        <select
          className='border p-2 rounded'
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
        >
          <option value=''>기수 전체</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default TutorFilterPanel;
