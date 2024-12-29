export function BaseLayout({ children, className = "" }) {
    return (
        <div className={`min-h-screen ${className}`}>
            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
    )
}
