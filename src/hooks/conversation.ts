import { useMutation, useQuery } from '@tanstack/react-query'
import axios from '../lib/axios'
import { CONTACT_PATH, CONVERSATION_SUMMARY_PATH } from '../constants/routes'
import type { AxiosResponse } from 'axios'

interface ConversationSummary {
  assignee_user_name: string[]
  author_email: string
  author_zipcode: string
  comments: string
  first_reply: number
  last_reply: number
  labels: string[]
  messages: string
  outcome: string
}

interface ContactUpdatePayload {
  zipcode?: string
  email?: string
}

interface MutationProps {
  phone: string
  zipcode?: string
  email?: string
}

const useConversationSummaryQuery = (conversationId: string, reference: string) =>
  useQuery({
    queryKey: ['conversationSummary', conversationId, reference],
    queryFn: async (): Promise<AxiosResponse<ConversationSummary>> =>
      axios.get(`${CONVERSATION_SUMMARY_PATH}/${conversationId}?reference=${encodeURIComponent(reference)}`)
    ,
    enabled: !!conversationId && !!reference,
    refetchInterval: 1000 * 30
  })

const useUpdateConversationSummary = () =>
  useMutation({
    mutationFn: async ({ phone, zipcode, email }: MutationProps) => {
      const updatedData = {} as ContactUpdatePayload
      // Allow empty to clear the field
      if (zipcode !== undefined) updatedData.zipcode = zipcode
      if (email !== undefined) updatedData.email = email
      return axios.patch(`${CONTACT_PATH}/${encodeURIComponent(phone)}`, updatedData)
    }
  })

export { useConversationSummaryQuery, useUpdateConversationSummary }
export type { ConversationSummary }

