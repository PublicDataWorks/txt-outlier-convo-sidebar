import { useQuery } from '@tanstack/react-query'
import axios from '../lib/axios'
import { CONVERSATION_SUMMARY_PATH } from '../constants/routes'
import type { AxiosResponse } from 'axios'

interface ConversationSummary {
  assignee_user_name: string[]
  author_email: string
  author_zipcode: string
  comments: string
  first_reply: Date | undefined
  labels: string[]
  messages: string
  outcome: string
}

const useConversationSummaryQuery = (conversationId: string, reference: string) =>
  useQuery({
    queryKey: ['conversationSummary', conversationId, reference],
    queryFn: async (): Promise<AxiosResponse<ConversationSummary>> =>
      axios.get(`${CONVERSATION_SUMMARY_PATH}?conversation_id=${conversationId}&reference=${reference}`)
    ,
    enabled: !!conversationId && !!reference,
  })

export { useConversationSummaryQuery }
export type { ConversationSummary }

