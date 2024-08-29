import { Children } from "react";

export default function MoviesDetailsLayout({children}: {children: React.ReactNode}) {
    return (
        <>
            {children}
            <footer className="w-[1303px] max-w-full h-[98px] bg-gray-900 mx-auto">
             <div className="flex items-center justify-center h-full px-4">
             <p className="text-white text-lg text-center">Movie List Footer Content</p>
            </div>
    </footer>
        </>
    )
}