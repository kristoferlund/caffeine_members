import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Member, AddMemberResult } from '../backend';

export function useMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, surname, email }: { name: string; surname: string; email: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMember(name, surname, email);
    },
    onSuccess: (result: AddMemberResult) => {
      if ('ok' in result) {
        queryClient.invalidateQueries({ queryKey: ['members'] });
      }
    },
  });
}
