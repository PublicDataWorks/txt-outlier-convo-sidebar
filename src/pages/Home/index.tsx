import { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { formatUnixTimestamp } from '../../helpers/date'
import { useConversationSummaryQuery } from '../../hooks/conversation'
import Spinner from '../../components/Spinner'

interface ContactInfo {
  name: string
  phoneNumber: string
}

interface QueryParams {
  conversationId: string
  reference: string
}

function Home() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    phoneNumber: ''
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
        const info: ContactInfo = { name: '', phoneNumber: '' }
        const params: QueryParams = { conversationId: '', reference: '' }
        // TS thinks it's a Conversation | undefined if we don't cast
        const convo: Conversation = conversations[0] as Conversation
        const contact = convo.authors.find(author => author.phone_number !== import.meta.env.VITE_OUTLIER_PHONE_NUMBER)
        if (contact) {
          info.name = contact.name
          info.phoneNumber = contact.phone_number
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
      <div className="relative z-0">
        <input type="text" id="floating-email"
               className="block py-2.5 px-0 w-full text-lg bg-transparent appearance-none focus:outline-none focus:ring-0 peer focus:shadow-none text-missive-text-color-e cursor-text"
               placeholder={conversation.author_email || ' '} />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="floating-email"
               className="text-missive-text-color-e cursor-text peer-focus:text-missive-blue-color absolute text-lg duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
          Email</label>
      </div>

      <div className="mt-2 rounded-xl bg-missive-light-border-color p-4">
        <div>
          First reply on <span className="font-bold">{formatUnixTimestamp(conversation.first_reply)}</span>
        </div>
        <div className="pt-2">
          Most recent reply on{' '}
          <span className="font-bold">
            {formatUnixTimestamp(conversation.last_reply)}
          </span>
        </div>
        <div className="pt-2 flex">
          <div>Zip code:</div>
          <div className="relative z-0 ml-1">
            <input type="number" id="floating-zipcode"
                   className="block w-full p-0 text-sm appearance-none focus:outline-none focus:ring-0 peer focus:shadow-none text-missive-text-color-e cursor-text"
                   placeholder={conversation.author_zipcode || ' '} />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="floating-zipcode"
                   className="px-2 text-missive-text-color-e cursor-text peer-focus:text-missive-blue-color absolute text-sm top-0 duration-300 transform -translate-y-4 scale-75 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
              Zip code</label>
          </div>
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
