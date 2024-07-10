import { useAnonKey } from '../providers/key'
import { useEffect, useState } from 'react'
import type { RealtimePostgresUpdatePayload } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

interface AuthorUpdatePayload {
  zipcode: string
  email: string
}

const useAuthorUpdates = () => {
  const { anonKey } = useAnonKey()
  const [email, setEmail] = useState('')
  const [zipcode, setZipcode] = useState('')

  useEffect(() => {
    if (anonKey) {
      const client = createClient(import.meta.env.VITE_SUPABASE_URL as string, anonKey)
      client
        .channel('author-updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'authors'
          },
          (payload: RealtimePostgresUpdatePayload<AuthorUpdatePayload>) => {
            if (payload.new.zipcode !== zipcode)
              setZipcode(payload.new.zipcode)
            if (payload.new.email !== email)
              setEmail(payload.new.email)
          }
        )
        .subscribe()

      return () => void client.removeAllChannels()
    }
    return () => {
    }
  }, [anonKey])

  return { email, setEmail, zipcode, setZipcode }
}
export default useAuthorUpdates
