
export default function Footer() {
    return (
        <>
            <p>
                Built with ♥ by {' '}
                <a href="https://github.com/prchowley" className="text-blue-500 hover:underline">
                    Priyabrata Chowley
                </a>
            </p>
            <p>
                Powered by {' '}
                <a href="https://react.dev/" className="text-blue-500 hover:underline">React</a>,
                <a href="https://tanstack.com/query/latest" className="text-blue-500 hover:underline"> TanStack Query</a>,
                <a href="https://ui.shadcn.com/" className="text-blue-500 hover:underline"> ShadCN</a>
                <span className="mx-1">and</span>
                <a href="https://tailwindcss.com" className="text-blue-500 hover:underline">Tailwind CSS</a>
            </p>
        </>
    )
}