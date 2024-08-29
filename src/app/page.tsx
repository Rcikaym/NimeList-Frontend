export default function Home() {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto p-4">
          <h2 className="text-3xl font-bold mb-4">Welcome to MyWebsite</h2>
          <p className="text-lg">
            This is a simple homepage built with Next.js and Tailwind CSS. 
            Tailwind CSS makes it easy to style components directly in your JSX.
          </p>
        </main>
      </div>
    );
  }