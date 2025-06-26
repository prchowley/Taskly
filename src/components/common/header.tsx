export default function Header() {
    return (
        <div className="w-full bg-white border border-black-200 py-6 px-8 flex flex-col items-center rounded-md">
            <h1 className="text-3xl font-extrabold text-black-200 tracking-tight">
                Taskly
            </h1>
            <span className="text-base mt-2 font-medium bg-white/60 rounded px-3 py-1">
                Organize your tasks efficiently
            </span>
        </div>
    )
}