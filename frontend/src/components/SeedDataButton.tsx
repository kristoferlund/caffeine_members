import React, { useState } from 'react';
import { useAddMember } from '../hooks/useQueries';
import type { AddMemberResult } from '../backend';

interface SeedDataButtonProps {
  onSuccess: (message: string, type: 'success') => void;
  onError: (message: string, type: 'error') => void;
}

export default function SeedDataButton({ onSuccess, onError }: SeedDataButtonProps) {
  const [isSeeding, setIsSeeding] = useState(false);
  const addMemberMutation = useAddMember();

  // Test data arrays
  const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Jessica',
    'William', 'Ashley', 'Richard', 'Amanda', 'Joseph', 'Stephanie', 'Thomas', 'Melissa', 'Christopher', 'Nicole',
    'Daniel', 'Jennifer', 'Matthew', 'Elizabeth', 'Anthony', 'Helen', 'Mark', 'Sandra', 'Donald', 'Donna',
    'Steven', 'Carol', 'Paul', 'Ruth', 'Andrew', 'Sharon', 'Joshua', 'Michelle', 'Kenneth', 'Laura',
    'Kevin', 'Sarah', 'Brian', 'Kimberly', 'George', 'Deborah', 'Edward', 'Dorothy', 'Ronald', 'Lisa',
    'Timothy', 'Nancy', 'Jason', 'Karen', 'Jeffrey', 'Betty', 'Ryan', 'Helen', 'Jacob', 'Sandra',
    'Gary', 'Donna', 'Nicholas', 'Carol', 'Eric', 'Ruth', 'Jonathan', 'Sharon', 'Stephen', 'Michelle',
    'Larry', 'Laura', 'Justin', 'Sarah', 'Scott', 'Kimberly', 'Brandon', 'Deborah', 'Benjamin', 'Dorothy',
    'Samuel', 'Lisa', 'Gregory', 'Nancy', 'Frank', 'Karen', 'Raymond', 'Betty', 'Alexander', 'Helen',
    'Patrick', 'Sandra', 'Jack', 'Donna', 'Dennis', 'Carol', 'Jerry', 'Ruth', 'Tyler', 'Sharon'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
    'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
    'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
    'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
    'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
    'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'
  ];

  const generateTestUsers = (count: number) => {
    const users = [];
    const usedEmails = new Set<string>();
    
    for (let i = 0; i < count; i++) {
      let email: string;
      let firstName: string;
      let lastName: string;
      
      // Keep generating until we get a unique email
      do {
        firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        // Create diverse email formats including dots in usernames
        const domains = ['example.com', 'test.org', 'demo.net', 'sample.edu', 'mock.gov', 'company.co.uk', 'university.ac.uk'];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        
        // Generate different email formats to test improved validation
        const emailFormats = [
          // Standard format with dot
          `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
          // Format without dot
          `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
          // Format with underscore
          `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${domain}`,
          // Format with plus (common in email aliases)
          `${firstName.toLowerCase()}+${lastName.toLowerCase()}@${domain}`,
          // Format with numbers
          `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 99)}@${domain}`,
          // Format with initials and dots
          `${firstName.charAt(0).toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
          // Format with middle initial
          `${firstName.toLowerCase()}.${String.fromCharCode(97 + Math.floor(Math.random() * 26))}.${lastName.toLowerCase()}@${domain}`,
          // Format with hyphen
          `${firstName.toLowerCase()}-${lastName.toLowerCase()}@${domain}`
        ];
        
        // Choose a random format, but favor the dot format for better testing
        let formatIndex;
        if (Math.random() < 0.4) {
          formatIndex = 0; // 40% chance for dot format
        } else {
          formatIndex = Math.floor(Math.random() * emailFormats.length);
        }
        
        email = emailFormats[formatIndex];
        
        // If email already exists, add a number suffix
        let counter = 1;
        const baseEmail = email;
        while (usedEmails.has(email)) {
          const atIndex = baseEmail.indexOf('@');
          email = baseEmail.substring(0, atIndex) + counter + baseEmail.substring(atIndex);
          counter++;
        }
      } while (usedEmails.has(email));
      
      usedEmails.add(email);
      
      users.push({
        name: firstName,
        surname: lastName,
        email: email
      });
    }
    return users;
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    
    try {
      const testUsers = generateTestUsers(100);
      let successCount = 0;
      let failCount = 0;
      const errors: string[] = [];

      // Add users in smaller batches to avoid overwhelming the system
      const batchSize = 5;
      for (let i = 0; i < testUsers.length; i += batchSize) {
        const batch = testUsers.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (user) => {
          try {
            const result: AddMemberResult = await addMemberMutation.mutateAsync(user);
            if ('ok' in result) {
              successCount++;
            } else {
              failCount++;
              errors.push(`${user.email}: ${result.err}`);
            }
          } catch {
            failCount++;
            errors.push(`${user.email}: Network error`);
          }
        });

        await Promise.all(batchPromises);
        
        // Longer delay between batches to prevent overwhelming
        if (i + batchSize < testUsers.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      if (successCount > 0) {
        onSuccess(`Successfully seeded ${successCount} test users with diverse email formats!`, 'success');
      }
      
      if (failCount > 0) {
        const errorMessage = `Failed to add ${failCount} users. First few errors: ${errors.slice(0, 3).join(', ')}`;
        onError(errorMessage, 'error');
      }
      
    } catch {
      onError('Failed to seed test data. Please try again.', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="win95-window bg-white border-win95-sunken p-2">
        <p className="text-xs font-mono text-black">
          🧪 <strong>Test Data:</strong> Click below to add 100 sample members with diverse email formats (including dots in usernames) for testing the pagination and sorting system.
        </p>
      </div>
      
      <button
        onClick={handleSeedData}
        disabled={isSeeding}
        className="w-full win95-button bg-win95-gray text-black py-2 px-4 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSeeding ? (
          <>
            <span className="win95-loading-dots mr-2">
              <span>●</span><span>●</span><span>●</span>
            </span>
            Seeding Test Data...
          </>
        ) : (
          '🌱 Seed 100 Test Users'
        )}
      </button>
    </div>
  );
}
