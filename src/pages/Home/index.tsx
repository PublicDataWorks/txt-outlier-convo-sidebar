import { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { formatUnixTimestamp } from '../../helpers/date'
import { useConversationSummaryQuery } from '../../hooks/conversation'
import Spinner from '../../components/Spinner'

interface ContactInfo {
  name: string
  phoneNumber: string
  mostRecentReplyAt: number | undefined
}

interface QueryParams {
  conversationId: string
  reference: string
}

function Home() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    phoneNumber: '',
    mostRecentReplyAt: undefined
  })
  const [queryParams, setQueryParams] = useState<QueryParams>({
    conversationId: '',
    reference: ''
  })
  const [keywordLabels, setKeywordLabels] = useState<string[]>([])
  const [impactLabels, setImpactLabels] = useState<string[]>([])
  // errorMsg === undefined means no error, empty string means an error without message
  const [errorMsg, setErrorMsg] = useState<string | undefined>('Please select an SMS conversation')
  const { data, isPending, error } = useConversationSummaryQuery(queryParams.conversationId, queryParams.reference)
  const handleConversationChange = debounce((ids: string[]) => {
    Missive.fetchConversations(ids)
      .then(conversations => {
        if (conversations.length !== 1) {
          // Select multiple tabs, that means user is not reading the conversation
          return
        }
        const info: ContactInfo = { name: '', phoneNumber: '', mostRecentReplyAt: undefined }
        const params: QueryParams = { conversationId: '', reference: '' }
        // TS thinks it's a Conversation | undefined if we don't cast
        const convo: Conversation = conversations[0] as Conversation
        const contact = convo.authors.find(author => author.phone_number !== import.meta.env.VITE_OUTLIER_PHONE_NUMBER)
        if (contact) {
          info.name = contact.name
          info.phoneNumber = contact.phone_number
          info.mostRecentReplyAt = convo.messages
            .slice()
            .reverse()
            .find(message => message.from_field.phone_number === contact.phone_number)?.delivered_at

          params.conversationId = convo.id
          params.reference = contact.phone_number

          setErrorMsg(undefined)
        } else {
          setErrorMsg('')
        }
        setContactInfo(info)
        setQueryParams(params)
      })
      // eslint-disable-next-line no-console
      .catch(console.error)
  }, 300)

  useEffect(() => {
    Missive.on('change:conversations', handleConversationChange)
  }, [])

  useEffect(() => {
    if (data?.data) {
      void Missive.fetchLabels().then(missivelabels => {
        const labelWithInfo = data.data.labels
          .map(labelId => missivelabels.find(label => label.id === labelId))

        const keywords = labelWithInfo
          .filter(label => label?.parent_id === import.meta.env.VITE_KEYWORD_LABEL_ID)
          // @ts-expect-error TS doesn't recognize that filter ensures non-null values
          .map(label => label.name)

        const impacts = labelWithInfo
          .filter(label => label && label.parent_id !== import.meta.env.VITE_KEYWORD_LABEL_ID)
          // @ts-expect-error TS doesn't recognize that filter ensures non-null values
          .map(label => label.name)

        setKeywordLabels(keywords)
        setImpactLabels(impacts)
      })
    }
  }, [data])

  if (errorMsg !== undefined || error) {
    // empty string is considered as an error that doesn't carry message
    return <div>{error ? error.message : errorMsg}</div>
  }

  if (isPending) {
    return <Spinner />
  }
  const conversation = data.data

  return (
    <div className="px-4 pt-2">
      <div className="text-xl font-bold">{contactInfo.name}</div>
      <div className="text-lg">{contactInfo.phoneNumber}</div>
      <div className="text-lg">{conversation.author_email}</div>

      <div className="mt-2 rounded-xl bg-missive-light-border-color p-4">
        <div>
          First reply on <span className="font-bold">{conversation.first_reply?.toISOString()}</span>
        </div>
        <div className="pt-2">
          Most recent reply on{' '}
          <span className="font-bold">
            {contactInfo.mostRecentReplyAt && contactInfo.mostRecentReplyAt > 0 ? formatUnixTimestamp(contactInfo.mostRecentReplyAt) : ''}
          </span>
        </div>
        <div className="pt-2">
          Zip code: <span className="font-bold">{conversation.author_zipcode}</span>
        </div>
        <div className="pt-2">
          Reporters contacted:{' '}
          <span className="font-bold">{conversation.assignee_user_name.join(', ')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywordLabels.map(tag => (
            <div key={tag} className="rounded-missive-border-radius bg-missive-text-color-d px-2 py-2 font-bold">
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-2 mt-4 font-bold">Reporter notes</div>
      <div className="rounded-xl bg-missive-light-border-color p-4 italic">{conversation.comments}</div>

      <div className="mb-2 mt-4 font-bold">Impact and outcomes</div>
      <div className="rounded-xl bg-missive-light-border-color p-4">
        <div className="pb-2 italic">{conversation.outcome}</div>
        <div className="flex flex-wrap gap-2 pt-2">
          {impactLabels.map(tag => (
            <div key={tag} className="rounded-missive-border-radius bg-missive-text-color-d px-2 py-2 font-bold">
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-2 mt-4 font-bold">Communication patterns</div>
      <div className="rounded-xl bg-missive-light-border-color p-4 italic">{conversation.messages}</div>
    </div>
  )
}

export default Home
