import { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { formatUnixTimestamp } from '../../helpers/date'
import { capitalize } from '../../helpers/string'

interface ContactInfo {
  name: string
  phoneNumber: string
  firstReplyAt: number | undefined
  mostRecentReplyAt: number | undefined
  reportersContacted: string[]
  tags: string[]
}

function Home() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>()
  const handleConversationChange = debounce((ids: string[]) => {
    Missive.fetchConversations(ids)
      .then(conversations => {
        if (conversations.length !== 1) {
          // Select multiple tabs, that means user is not reading the conversation
          return
        }
        const info: ContactInfo = {
          name: '',
          phoneNumber: '',
          firstReplyAt: undefined,
          mostRecentReplyAt: undefined,
          reportersContacted: [],
          tags: []
        }
        // TS thinks it's a Conversation | undefined if we don't cast
        const convo: Conversation = conversations[0] as Conversation
        const contact = convo.authors.find(author => author.phone_number !== import.meta.env.VITE_OUTLIER_PHONE_NUMBER)
        if (contact) {
          info.name = contact.name
          info.phoneNumber = contact.phone_number
        }
        if (contact) {
          info.firstReplyAt = convo.messages.find(
            message => message.from_field.phone_number === contact.phone_number
          )?.delivered_at
          info.mostRecentReplyAt = convo.messages
            .slice()
            .reverse()
            .find(message => message.from_field.phone_number === contact.phone_number)?.delivered_at
        }
        const reporters = convo.messages
          .filter(message => !!message.author)
          .map(message => `${message.author?.first_name ?? ''} ${message.author?.last_name ?? ''}`.trim())
        info.reportersContacted = [...new Set(reporters)]
        info.tags = convo.labels.map(label => capitalize(label.name))

        setContactInfo(info)
      })
      // eslint-disable-next-line no-console
      .catch(console.error)
  }, 300)

  useEffect(() => {
    Missive.on('change:conversations', handleConversationChange)
  }, [])

  const impactTags = ['Satisfied', 'Accountability gap']
  return (
    <div className="px-4 pt-2">
      <div className="text-xl font-bold">{contactInfo?.name ?? ''}</div>
      <div className="text-lg">{contactInfo?.phoneNumber ?? ''}</div>
      <div className="text-lg">email@email.com</div>

      <div className="mt-2 rounded-sm bg-missive-light-border-color p-4">
        <div className="pt-2">
          First reply on <span className="font-bold">{formatUnixTimestamp(contactInfo?.firstReplyAt ?? 0)}</span>
        </div>
        <div className="pt-2">
          Most recent reply on{' '}
          <span className="font-bold">{formatUnixTimestamp(contactInfo?.mostRecentReplyAt ?? 0)}</span>
        </div>
        <div className="pt-2">
          Segment: <span className="font-bold">Connected</span>
        </div>
        <div className="pt-2">
          Zip code: <span className="font-bold">48127</span>
        </div>
        <div className="pt-2">
          Reporters contacted:
          <span className="font-bold">{contactInfo?.reportersContacted.join(', ')}</span>
        </div>
        <div className="py-2">Tags</div>
        <div className="flex flex-wrap gap-2">
          {contactInfo?.tags.map(tag => (
            <div key={tag} className="rounded-missive-border-radius bg-missive-text-color-d px-2 py-2 font-bold">
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-2 mt-4 font-bold">Reporters Notes</div>
      <div className="rounded-sm bg-missive-light-border-color p-4 italic">
        A summary of all comments left in the thread by reporters over time. Recommendations the reporters made,
        handoffs to other reporters, process/case notes, phone call notes,
      </div>

      <div className="mb-2 mt-4 font-bold">Impact and outcomes</div>
      <div className="rounded-sm bg-missive-light-border-color p-4">
        <div className="pb-2 italic">
          A short summary of impact/conversation outcomes for this contact. Detailing whether their issues have
          consistently been addressed, or if they were unable to get the help they needed.
        </div>
        Impact tags
        <div className="flex flex-wrap gap-2 pt-2">
          {impactTags.map(tag => (
            <div key={tag} className="rounded-missive-border-radius bg-missive-text-color-d px-2 py-2 font-bold">
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-2 mt-4 font-bold">Communication patterns</div>
      <div className="rounded-sm bg-missive-light-border-color p-4 italic">
        A summary detailing the contact general tone and approach during the conversations. Here we could flag if a
        contact has been abusive or rude in their communications with Outlier staff. Also include relevant case notes
        (e.g., this person never follows up after we provide info), notes from phone calls.
      </div>
    </div>
  )
}

export default Home
