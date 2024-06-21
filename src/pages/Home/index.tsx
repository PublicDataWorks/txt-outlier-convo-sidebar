function Home() {
  const infoTags = ['Land bank', 'Landlord', 'Taxes']
  const impactTags = ['Satisfied', 'Accountability gap']
  return (
    <div className="px-4 pt-2">
      <div className="text-xl font-bold">Nia Silvio</div>
      <div className="text-lg">+13126185863</div>
      <div className="text-lg">email@email.com</div>

      <div className="bg-missive-light-border-color mt-2 p-4">
        <div className="pt-2">First reply on <span className="font-bold">Wed May 1, 2024</span></div>
        <div className="pt-2">Most recent reply on <span className="font-bold">Wed June 5, 2024</span></div>
        <div className="pt-2">Segment: <span className="font-bold">Connected</span></div>
        <div className="pt-2">Zip code: <span className="font-bold">48127</span></div>
        <div className="pt-2">
          Reporters contacted:
          <span className="font-bold">Sarah Alvarez, SaMya Overall, Aaron Mondry</span>
        </div>
        <div className="py-2">Tags</div>
        <div className="flex">
          {infoTags.map(tag => (
            <div key={tag}
                 className="px-2 py-2 mr-2 rounded-missive-border-radius bg-missive-text-color-d font-bold">{tag}</div>
          ))}
        </div>
      </div>

      <div className="font-bold mt-4 mb-2">Reporters Notes</div>
      <div className="bg-missive-light-border-color p-4 italic">
        A summary of all comments left in the thread by reporters over time. Recommendations the reporters made,
        handoffs to other reporters, process/case notes, phone call notes,
      </div>

      <div className="font-bold mt-4 mb-2">Impact and outcomes</div>
      <div className="bg-missive-light-border-color p-4">
        <div className="italic pb-2">
          A short summary of impact/conversation outcomes for this contact. Detailing whether their
          issues have consistently been addressed, or if they were unable to get the help they needed.
        </div>
        Impact tags
        <div className="flex pt-2">
          {impactTags.map(tag => (
            <div key={tag}
                 className="px-2 py-2 mr-2 rounded-missive-border-radius bg-missive-text-color-d font-bold">{tag}</div>
          ))}
        </div>
      </div>

      <div className="font-bold mt-4 mb-2">Communication patterns</div>
      <div className="bg-missive-light-border-color p-4 italic">
        A summary detailing the contact general tone and approach during the conversations. Here we could flag if a
        contact has been abusive or rude in their communications with Outlier staff. Also include relevant case notes
        (e.g., this person never follows up after we provide info), notes from phone calls.
      </div>

    </div>
  )
}

export default Home
