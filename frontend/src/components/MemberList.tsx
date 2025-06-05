import React, { useState } from 'react';
import { useMembers } from '../hooks/useQueries';
import type { Member } from '../backend';

interface MemberListProps {
  onMemberSelect: (member: Member) => void;
  secretMode?: boolean;
}

type SortField = 'name' | 'surname';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export default function MemberList({ onMemberSelect, secretMode }: MemberListProps) {
  const { data: members, isLoading, error } = useMembers();
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="win95-window bg-win95-gray border-win95-sunken p-4">
          <div className="flex items-center space-x-3">
            <div className="win95-loading-dots">
              <span>●</span><span>●</span><span>●</span>
            </div>
            <span className="text-black text-sm font-mono">Loading members...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="win95-window bg-win95-gray border-win95-sunken p-4">
          <div className="text-black mb-4">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-sm font-bold font-mono">System Error</p>
            <p className="text-xs font-mono mt-2">Failed to load members. Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="win95-window bg-win95-gray border-win95-sunken p-4">
          <div className="text-black">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-sm font-bold font-mono">No Records Found</p>
            <p className="text-xs font-mono mt-2">Register your first member to get started</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const aValue = a[sortField].toLowerCase();
    const bValue = b[sortField].toLowerCase();
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const totalPages = Math.ceil(sortedMembers.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMembers = sortedMembers.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(0); // Reset to first page when sorting
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const getSortArrow = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="win95-window bg-win95-gray border-win95-raised p-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-black">🔍 Search:</span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, surname, or email..."
            className="flex-1 px-2 py-1 border-win95-sunken bg-white text-black text-xs font-mono focus:outline-none focus:border-win95-blue"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="win95-button bg-win95-gray text-black px-2 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Member Count and Page Info */}
      <div className="win95-window bg-white border-win95-sunken p-2">
        <div className="flex justify-between items-center text-xs font-mono text-black">
          <span>
            {searchTerm ? `Found: ${filteredMembers.length} / ${members.length}` : `Total Members: ${members.length}`}
            {secretMode && ' 🎮'}
          </span>
          <span>Page {currentPage + 1} of {totalPages}</span>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="win95-window bg-win95-gray border-win95-raised p-2">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-xs font-mono text-black">Sort by:</span>
          <button
            onClick={() => handleSort('name')}
            className={`win95-button px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken flex items-center space-x-1 ${
              sortField === 'name' ? (secretMode ? 'bg-purple-600 text-white' : 'bg-win95-blue text-white') : 'bg-win95-gray text-black'
            }`}
          >
            <span>First Name</span>
            <span className="text-sm">{getSortArrow('name')}</span>
          </button>
          <button
            onClick={() => handleSort('surname')}
            className={`win95-button px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken flex items-center space-x-1 ${
              sortField === 'surname' ? (secretMode ? 'bg-purple-600 text-white' : 'bg-win95-blue text-white') : 'bg-win95-gray text-black'
            }`}
          >
            <span>Last Name</span>
            <span className="text-sm">{getSortArrow('surname')}</span>
          </button>
        </div>
      </div>

      {/* Member List */}
      <div className="space-y-2 min-h-[320px]">
        {currentMembers.map((member: Member, index: number) => (
          <div
            key={member.email}
            className={`win95-window bg-white border-win95-sunken p-3 hover:text-white transition-colors cursor-pointer ${
              secretMode ? 'hover:bg-purple-600' : 'hover:bg-win95-highlight'
            }`}
            onClick={() => onMemberSelect(member)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-mono text-black bg-win95-gray border-win95-raised px-2 py-1 min-w-[2rem] text-center">
                  {startIndex + index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm font-mono">
                    {searchTerm ? (
                      <>
                        {member.name.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                          <span className="bg-yellow-200 text-black px-1">
                            {member.name}
                          </span>
                        ) : member.name}
                        {' '}
                        {member.surname.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                          <span className="bg-yellow-200 text-black px-1">
                            {member.surname}
                          </span>
                        ) : member.surname}
                      </>
                    ) : (
                      `${member.name} ${member.surname}`
                    )}
                  </h3>
                  {searchTerm && member.email.toLowerCase().includes(searchTerm.toLowerCase()) && (
                    <p className="text-xs font-mono opacity-60">
                      <span className="bg-yellow-200 text-black px-1">
                        {member.email}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className="text-xs font-mono opacity-60">
                👆 Click for details
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="win95-window bg-win95-gray border-win95-raised p-3">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="win95-button bg-win95-gray text-black px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span className="text-lg">◀</span>
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="win95-window bg-white border-win95-sunken px-3 py-1">
              <span className="text-xs font-mono text-black">
                Showing {startIndex + 1}-{Math.min(endIndex, sortedMembers.length)} of {sortedMembers.length}
              </span>
            </div>
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1}
            className="win95-button bg-win95-gray text-black px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>Next</span>
            <span className="text-lg">▶</span>
          </button>
        </div>

        {/* Page Indicator Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-3 space-x-1">
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
              const pageIndex = totalPages <= 10 ? i : 
                currentPage < 5 ? i :
                currentPage > totalPages - 6 ? totalPages - 10 + i :
                currentPage - 4 + i;
              
              return (
                <button
                  key={pageIndex}
                  onClick={() => setCurrentPage(pageIndex)}
                  className={`w-6 h-6 text-xs font-mono border-win95-raised ${
                    currentPage === pageIndex 
                      ? (secretMode ? 'bg-purple-600 text-white' : 'bg-win95-blue text-white')
                      : 'bg-win95-gray text-black hover:bg-win95-highlight hover:text-white'
                  }`}
                >
                  {pageIndex + 1}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
