import EmbedClient from '@/components/EmbedClient'
import { getSession } from '@/lib/getSession'
import React from 'react'

async function page() {
    const session = await getSession()
    // Pass an empty string if session is missing; EmbedClient will show an error message
    const ownerId = session?.user?.id ?? ""

  return (
    <>
      <EmbedClient ownerId={ownerId}/>
    </>
  )
}

export default page
