import PageTitle from "@/components/TitlePage";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10">
      <PageTitle title="NimeList - Create New Topic" />
      <h1 className="text-3xl md:text-4xl ml-16 font-bold text-green-500 text-start">
        Create New Topic
      </h1>
      <div className="mt-6 text-start max-w-3xl ml-16">
        <h2 className="text-xl md:text-2xl font-semibold text-green-400">
          How to Write a Good Topic Discussion
        </h2>
        <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
          <li>
            <strong className="text-white">Choose a Clear Title:</strong> Make
            it specific and summarize the main point.
          </li>
          <li>
            <strong className="text-white">Introduce the Topic:</strong> Provide
            context or background information.
          </li>
          <li>
            <strong className="text-white">
              State the Purpose or Question:
            </strong>{" "}
            Clearly outline the discussion’s aim.
          </li>
          <li>
            <strong className="text-white">
              Share Your Thoughts or Experiences:
            </strong>{" "}
            Offer your insights to kickstart the conversation.
          </li>
          <li>
            <strong className="text-white">Encourage Engagement:</strong> Invite
            others to share their views and experiences.
          </li>
          <li>
            <strong className="text-white">
              Be Respectful and Open-Minded:
            </strong>{" "}
            Maintain a positive tone and be open to different perspectives.
          </li>
        </ul>
      </div>

      <form className="mt-10 max-w-3xl space-y-6 ml-16">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Introduce the Points and Objectives"
            className="mt-2 w-full border border-green-500 bg-black text-white rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-300"
          >
            Compose Your Main Content Discussion
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            placeholder="Example: Share your thoughts on trends, character development, or any other points you find intriguing."
            className="mt-2 w-full border border-green-500 bg-black text-white rounded-lg px-4 py-2"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-300"
          >
            Tag Your Topic
          </label>
          <select
            id="tags"
            name="tags"
            className="mt-2 w-full border border-green-500 bg-black text-white rounded-lg px-4 py-2"
          >
            <option value="">Choose relevant tags (e.g., anime)</option>
            <option value="anime">Anime</option>
            <option value="manga">Manga</option>
            <option value="movies">Movies</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-black font-semibold py-2 rounded-lg hover:bg-green-400"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
